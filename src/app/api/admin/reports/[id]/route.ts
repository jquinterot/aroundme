import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (session.role !== 'admin') {
      return errorResponse('Admin access required', 403, 'FORBIDDEN');
    }

    const { id } = await params;
    const body = await request.json();
    const { action, adminNote } = body;

    if (!action) {
      return errorResponse('Action is required', 400, 'MISSING_ACTION');
    }
    if (action !== 'resolve' && action !== 'dismiss' && action !== 'review') {
      return errorResponse('Action must be one of: resolve, dismiss, review', 400, 'INVALID_ACTION');
    }

    const report = await prisma.adminReport.findUnique({
      where: { id },
    });

    if (!report) {
      return errorResponse('Report not found', 404, 'REPORT_NOT_FOUND');
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
    return handleApiError(error, 'admin report update');
  }
}
