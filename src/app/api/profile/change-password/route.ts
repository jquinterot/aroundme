import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('You must be logged in to change your password', 401, 'UNAUTHORIZED');
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword) {
      return errorResponse('La contraseña actual es requerida', 400, 'CURRENT_PASSWORD_REQUIRED');
    }

    if (!newPassword) {
      return errorResponse('La nueva contraseña es requerida', 400, 'NEW_PASSWORD_REQUIRED');
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return errorResponse('La nueva contraseña debe tener al menos 6 caracteres', 400, 'PASSWORD_TOO_SHORT');
    }

    if (newPassword.length > 100) {
      return errorResponse('La nueva contraseña no puede exceder 100 caracteres', 400, 'PASSWORD_TOO_LONG');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return errorResponse('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    const bcrypt = await import('bcrypt');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return errorResponse('La contraseña actual es incorrecta', 400, 'INVALID_PASSWORD');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/profile/change-password');
  }
}
