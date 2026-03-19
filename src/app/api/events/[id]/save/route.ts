import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please login to save events' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const existingSave = await prisma.save.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: id,
        },
      },
    });

    if (existingSave) {
      await prisma.save.delete({
        where: { id: existingSave.id },
      });
      await prisma.event.update({
        where: { id },
        data: { saveCount: { decrement: 1 } },
      });
      return NextResponse.json({ success: true, data: { saved: false } });
    } else {
      await prisma.save.create({
        data: {
          userId: user.id,
          eventId: id,
        },
      });
      await prisma.event.update({
        where: { id },
        data: { saveCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, data: { saved: true } });
    }
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save event' },
      { status: 500 }
    );
  }
}
