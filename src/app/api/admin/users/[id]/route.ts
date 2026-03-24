import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const { action, role } = body;

    if (!action) {
      return errorResponse('Action is required', 400, 'MISSING_ACTION');
    }

    if (action === 'changeRole') {
      if (!role) {
        return errorResponse('Role is required for changeRole action', 400, 'MISSING_ROLE');
      }
      if (role !== 'user' && role !== 'organizer' && role !== 'admin') {
        return errorResponse('Role must be one of: user, organizer, admin', 400, 'INVALID_ROLE');
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role },
      });

      return NextResponse.json({
        success: true,
        message: `User role changed to ${role}`,
        data: { role: user.role },
      });
    }

    if (action === 'verify') {
      const user = await prisma.user.update({
        where: { id },
        data: { isVerified: true },
      });

      return NextResponse.json({
        success: true,
        message: 'User verified',
        data: { isVerified: user.isVerified },
      });
    }

    if (action === 'unverify') {
      const user = await prisma.user.update({
        where: { id },
        data: { isVerified: false },
      });

      return NextResponse.json({
        success: true,
        message: 'User unverified',
        data: { isVerified: user.isVerified },
      });
    }

    return errorResponse('Invalid action. Must be one of: changeRole, verify, unverify', 400, 'INVALID_ACTION');
  } catch (error) {
    return handleApiError(error, 'admin user update');
  }
}

export async function DELETE(
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

    if (id === session.id) {
      return errorResponse('Cannot delete yourself', 400, 'SELF_DELETE_NOT_ALLOWED');
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'admin user delete');
  }
}
