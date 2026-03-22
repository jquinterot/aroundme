import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, adminNote } = body;

    const report = await prisma.adminReport.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    let updatedReport;
    let actionTaken = '';

    if (action === 'resolve') {
      updatedReport = await prisma.adminReport.update({
        where: { id },
        data: {
          status: 'resolved',
          adminId: session.id,
          adminNote,
        },
      });
      actionTaken = 'resolved';
    } else if (action === 'dismiss') {
      updatedReport = await prisma.adminReport.update({
        where: { id },
        data: {
          status: 'dismissed',
          adminId: session.id,
          adminNote,
        },
      });
      actionTaken = 'dismissed';
    } else if (action === 'review') {
      updatedReport = await prisma.adminReport.update({
        where: { id },
        data: {
          status: 'reviewed',
          adminId: session.id,
        },
      });
      actionTaken = 'marked as reviewed';
    }

    if (report.reporterId && actionTaken) {
      await createNotification({
        userId: report.reporterId,
        type: 'report_resolved',
        title: 'Report Update',
        message: `Your report has been ${actionTaken}.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Report ${actionTaken}`,
      data: updatedReport,
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
