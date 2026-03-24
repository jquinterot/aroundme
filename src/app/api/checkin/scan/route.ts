import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { validateQRToken, performCheckIn } from '@/lib/checkin';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { qrToken, eventId: organizerEventId } = await request.json();

    if (!qrToken) {
      return errorResponse('qrToken es requerido para escanear', 400, 'MISSING_QR_TOKEN');
    }

    const qrData = validateQRToken(qrToken);

    if (!qrData) {
      return errorResponse('Código QR inválido o expirado', 400, 'INVALID_QR_CODE');
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
    return handleApiError(error, 'POST /api/checkin/scan');
  }
}
