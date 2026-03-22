import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const { action, role } = body;

    if (action === 'changeRole') {
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

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (id === session.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete yourself' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
