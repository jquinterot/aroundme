import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { validateQRToken, performCheckIn } from '@/lib/checkin';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { qrToken, eventId: organizerEventId } = await request.json();

    if (!qrToken) {
      return NextResponse.json(
        { success: false, error: 'QR token requerido' },
        { status: 400 }
      );
    }

    const qrData = validateQRToken(qrToken);

    if (!qrData) {
      return NextResponse.json(
        { success: false, error: 'Código QR inválido o expirado' },
        { status: 400 }
      );
    }

    const eventId = organizerEventId || qrData.eventId;

    const result = await performCheckIn(
      eventId,
      qrData.userId,
      qrData.ticketTypeId,
      'qr_code'
    );

    return NextResponse.json({
      success: true,
      data: {
        valid: result.success,
        message: result.message,
        eventId: qrData.eventId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
