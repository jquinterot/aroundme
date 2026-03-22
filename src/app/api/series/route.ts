import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  createEventSeries, 
  getEventSeries, 
  updateSeries, 
  cancelSeriesEvent,
  deleteSeries 
} from '@/lib/recurring-events';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { name, description, frequency, interval, dayOfWeek, dayOfMonth, startDate, endDate, occurrences, templateEventId } = body;

    if (!name || !frequency || !startDate || !templateEventId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
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
    const seriesId = searchParams.get('id');

    if (!seriesId) {
      return NextResponse.json(
        { success: false, error: 'ID de serie requerido' },
        { status: 400 }
      );
    }

    const series = await getEventSeries(seriesId);

    if (!series) {
      return NextResponse.json(
        { success: false, error: 'Serie no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: series,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('id');
    const action = searchParams.get('action') || 'update';

    if (!seriesId) {
      return NextResponse.json(
        { success: false, error: 'ID de serie requerido' },
        { status: 400 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
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
    const seriesId = searchParams.get('id');
    const deleteEvents = searchParams.get('deleteEvents') || 'none';

    if (!seriesId) {
      return NextResponse.json(
        { success: false, error: 'ID de serie requerido' },
        { status: 400 }
      );
    }

    await deleteSeries(seriesId, deleteEvents as any);

    return NextResponse.json({
      success: true,
      message: 'Serie eliminada',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
