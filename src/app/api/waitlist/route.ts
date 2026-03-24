import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { joinWaitlist, leaveWaitlist, getWaitlistPosition, getEventWaitlist } from '@/lib/waitlist';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { eventId, notifyAt } = await request.json();

    if (!eventId) {
      return errorResponse('eventId es requerido para unirse a la lista de espera', 400, 'MISSING_EVENT_ID');
    }

    const result = await joinWaitlist(session.id, eventId, notifyAt);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Te has agregado a la lista de espera en posición ${result.position}`,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/waitlist');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return errorResponse('eventId es requerido para salir de la lista de espera', 400, 'MISSING_EVENT_ID');
    }

    await leaveWaitlist(session.id, eventId);

    return NextResponse.json({
      success: true,
      message: 'Has salido de la lista de espera',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/waitlist');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');
    const session = await getSession();

    if (eventId) {
      const waitlist = await getEventWaitlist(eventId);
      return NextResponse.json({
        success: true,
        data: waitlist,
      });
    }

    if (userId && session?.id === userId) {
      const position = await getWaitlistPosition(session.id, userId);
      return NextResponse.json({
        success: true,
        data: { position },
      });
    }

    return errorResponse('Parámetros inválidos - se requiere eventId o userId', 400, 'INVALID_PARAMS');
  } catch (error) {
    return handleApiError(error, 'GET /api/waitlist');
  }
}
