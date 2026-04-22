import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '@/lib/social';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const session = await getSession();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const profile = await getUserProfile(userId, session?.id);

    if (!profile) {
      return errorResponse('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/users/[id]');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { name, bio, avatarUrl, website, instagram, cityId } = body;

    if (name !== undefined && (name.length < 1 || name.length > 200)) {
      return errorResponse('El nombre debe tener entre 1 y 200 caracteres', 400, 'INVALID_NAME');
    }

    if (bio !== undefined && bio.length > 1000) {
      return errorResponse('La biografía no puede exceder 1000 caracteres', 400, 'INVALID_BIO');
    }

    const profile = await updateUserProfile(session.id, {
      name,
      bio,
      avatarUrl,
      website,
      instagram,
      cityId,
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Perfil actualizado',
    });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/users/[id]');
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}
