import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  createEventSeries, 
  getEventSeries, 
  updateSeries, 
  cancelSeriesEvent,
  deleteSeries 
} from '@/lib/recurring-events';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const body = await request.json();

    const { name, description, frequency, interval, dayOfWeek, dayOfMonth, startDate, endDate, occurrences, templateEventId } = body;

    if (!name) {
      return errorResponse('name es requerido para crear una serie', 400, 'MISSING_NAME');
    }
    if (!frequency) {
      return errorResponse('frequency es requerido para crear una serie', 400, 'MISSING_FREQUENCY');
    }
    if (!startDate) {
      return errorResponse('startDate es requerido para crear una serie', 400, 'MISSING_START_DATE');
    }
    if (!templateEventId) {
      return errorResponse('templateEventId es requerido para crear una serie', 400, 'MISSING_TEMPLATE_EVENT_ID');
    }

    const result = await createEventSeries(session.id, {
      name,
      description,
      frequency,
      interval,
      dayOfWeek,
      dayOfMonth,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      occurrences,
      templateEventId,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Serie creada con ${result.events.length} eventos`,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/series');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('id');

    if (!seriesId) {
      return errorResponse('series ID es requerido para obtener la serie', 400, 'MISSING_SERIES_ID');
    }

    const series = await getEventSeries(seriesId);

    if (!series) {
      return errorResponse('Serie no encontrada', 404, 'SERIES_NOT_FOUND');
    }

    return NextResponse.json({
      success: true,
      data: series,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/series');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('id');
    const action = searchParams.get('action') || 'update';

    if (!seriesId) {
      return errorResponse('series ID es requerido para actualizar la serie', 400, 'MISSING_SERIES_ID');
    }

    const body = await request.json();

    if (action === 'cancel') {
      const event = await cancelSeriesEvent(seriesId, body.eventId);
      return NextResponse.json({
        success: true,
        data: event,
        message: 'Evento de la serie cancelado',
      });
    }

    const result = await updateSeries(
      seriesId,
      body.updates || body,
      body.applyTo || 'none'
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Serie actualizada',
    });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/series');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'AUTH_REQUIRED');
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('id');
    const deleteEvents = searchParams.get('deleteEvents') || 'none';

    if (!seriesId) {
      return errorResponse('series ID es requerido para eliminar la serie', 400, 'MISSING_SERIES_ID');
    }

    await deleteSeries(seriesId, deleteEvents as 'all' | 'future' | 'none');

    return NextResponse.json({
      success: true,
      message: 'Serie eliminada',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/series');
  }
}
