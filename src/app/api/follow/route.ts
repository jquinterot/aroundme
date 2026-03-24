import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { followUser, unfollowUser, getFollowers, getFollowing } from '@/lib/social';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'UNAUTHORIZED');
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return errorResponse('El ID de usuario a seguir es requerido', 400, 'FOLLOWING_ID_REQUIRED');
    }

    if (typeof followingId !== 'string' || followingId.length < 1) {
      return errorResponse('ID de usuario inválido', 400, 'INVALID_FOLLOWING_ID');
    }

    if (followingId === session.id) {
      return errorResponse('No puedes seguirte a ti mismo', 400, 'CANNOT_FOLLOW_SELF');
    }

    const follow = await followUser(session.id, followingId);

    return NextResponse.json({
      success: true,
      data: follow,
      message: 'Ahora sigues a este usuario',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/follow');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Por favor inicia sesión', 401, 'UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get('userId');

    if (!followingId) {
      return errorResponse('El ID de usuario a dejar de seguir es requerido', 400, 'FOLLOWING_ID_REQUIRED');
    }

    if (typeof followingId !== 'string' || followingId.length < 1) {
      return errorResponse('ID de usuario inválido', 400, 'INVALID_FOLLOWING_ID');
    }

    await unfollowUser(session.id, followingId);

    return NextResponse.json({
      success: true,
      message: 'Has dejado de seguir a este usuario',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/follow');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'followers';
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;

    if (!userId) {
      return errorResponse('El ID de usuario es requerido', 400, 'USER_ID_REQUIRED');
    }

    if (typeof userId !== 'string' || userId.length < 1) {
      return errorResponse('ID de usuario inválido', 400, 'INVALID_USER_ID');
    }

    if (!['followers', 'following'].includes(type)) {
      return errorResponse('El tipo debe ser "followers" o "following"', 400, 'INVALID_TYPE');
    }

    if (isNaN(page) || page < 1) {
      return errorResponse('La página debe ser un número mayor a 0', 400, 'INVALID_PAGE');
    }

    if (type === 'followers') {
      const data = await getFollowers(userId, page);
      return NextResponse.json({ success: true, ...data });
    } else {
      const data = await getFollowing(userId, page);
      return NextResponse.json({ success: true, ...data });
    }
  } catch (error) {
    return handleApiError(error, 'GET /api/follow');
  }
}
