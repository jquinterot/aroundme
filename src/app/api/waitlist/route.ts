import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { joinWaitlist, leaveWaitlist, getWaitlistPosition, getEventWaitlist } from '@/lib/waitlist';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { eventId, notifyAt } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'ID de evento requerido' },
        { status: 400 }
      );
    }

    const result = await joinWaitlist(session.id, eventId, notifyAt);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Te has agregado a la lista de espera en posición ${result.position}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'ID de evento requerido' },
        { status: 400 }
      );
    }

    await leaveWaitlist(session.id, eventId);

    return NextResponse.json({
      success: true,
      message: 'Has salido de la lista de espera',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
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

    return NextResponse.json(
      { success: false, error: 'Parámetros inválidos' },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
