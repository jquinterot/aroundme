import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to view your profile', 401, 'UNAUTHORIZED');
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        cityId: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return errorResponse('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    return handleApiError(error, 'GET /api/profile');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to update your profile', 401, 'UNAUTHORIZED');
    }

    const { name, cityId } = await request.json();

    if (name !== undefined) {
      if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
        return errorResponse('El nombre debe tener entre 2 y 100 caracteres', 400, 'INVALID_NAME');
      }
    }

    if (cityId !== undefined) {
      const city = await prisma.city.findUnique({ where: { id: cityId } });
      if (!city) {
        return errorResponse('Ciudad inválida', 400, 'INVALID_CITY');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(cityId !== undefined && { cityId }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        cityId: true,
        isVerified: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/profile');
  }
}
