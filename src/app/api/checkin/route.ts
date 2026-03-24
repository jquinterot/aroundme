import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  performCheckIn, 
  getEventCheckIns, 
  getUserCheckIns, 
  generateCheckInReport
} from '@/lib/checkin';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { eventId, ticketTypeId, method } = await request.json();

    if (!eventId) {
      return errorResponse('eventId es requerido para realizar el check-in', 400, 'MISSING_EVENT_ID');
    }

    const result = await performCheckIn(
      eventId,
      session.id,
      ticketTypeId,
      method || 'manual'
    );

    return NextResponse.json({
      success: result.success,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/checkin');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');
    const report = searchParams.get('report') === 'true';
    const session = await getSession();

    if (eventId) {
      if (report) {
        const reportData = await generateCheckInReport(eventId);
        return NextResponse.json({
          success: true,
          data: reportData,
        });
      }

      const checkIns = await getEventCheckIns(eventId);
      return NextResponse.json({
        success: true,
        ...checkIns,
      });
    }

    if (userId && session?.id === userId) {
      const checkIns = await getUserCheckIns(session.id);
      return NextResponse.json({
        success: true,
        data: checkIns,
      });
    }

    return errorResponse('Parámetros inválidos - se requiere eventId o userId', 400, 'INVALID_PARAMS');
  } catch (error) {
    return handleApiError(error, 'GET /api/checkin');
  }
}
