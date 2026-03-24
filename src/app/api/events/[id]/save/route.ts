import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required to save events', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
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
    return handleApiError(error, 'POST save event');
  }
}
