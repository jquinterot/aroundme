import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateICS, generateGoogleCalendarUrl, generateOutlookUrl, generateYahooUrl } from '@/lib/calendar-export';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'ics';

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        city: { select: { name: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const eventData = {
      id: event.id,
      title: event.title,
      description: event.description,
      dateStart: event.dateStart,
      dateEnd: event.dateEnd,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      imageUrl: event.imageUrl,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/event/${event.id}`,
    };

    switch (format) {
      case 'google':
        return NextResponse.redirect(
          generateGoogleCalendarUrl({
            title: eventData.title,
            dateStart: eventData.dateStart,
            dateEnd: eventData.dateEnd,
            venueName: eventData.venueName,
            venueAddress: eventData.venueAddress,
            description: eventData.description,
            url: eventData.url,
          })
        );

      case 'outlook':
        return NextResponse.redirect(
          generateOutlookUrl({
            title: eventData.title,
            dateStart: eventData.dateStart,
            dateEnd: eventData.dateEnd,
            venueName: eventData.venueName,
            venueAddress: eventData.venueAddress,
            description: eventData.description,
          })
        );

      case 'yahoo':
        return NextResponse.redirect(
          generateYahooUrl({
            title: eventData.title,
            dateStart: eventData.dateStart,
            dateEnd: eventData.dateEnd,
            venueName: eventData.venueName,
            description: eventData.description,
          })
        );

      case 'ics':
      default:
        const ics = generateICS(eventData);
        return new NextResponse(ics, {
          headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_')}.ics"`,
          },
        });
    }
  } catch (error) {
    console.error('Calendar export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}
