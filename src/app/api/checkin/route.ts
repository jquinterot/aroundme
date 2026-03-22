import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  performCheckIn, 
  getEventCheckIns, 
  getUserCheckIns, 
  generateCheckInReport,
  validateQRToken,
  generateQRToken 
} from '@/lib/checkin';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { eventId, ticketTypeId, method } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'ID de evento requerido' },
        { status: 400 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
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

    return NextResponse.json(
      { success: false, error: 'Parámetros inválidos' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
