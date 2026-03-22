import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { followUser, unfollowUser, isFollowing, getFollowers, getFollowing } from '@/lib/social';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const follow = await followUser(session.id, followingId);

    return NextResponse.json({
      success: true,
      data: follow,
      message: 'Ahora sigues a este usuario',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get('userId');

    if (!followingId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    await unfollowUser(session.id, followingId);

    return NextResponse.json({
      success: true,
      message: 'Has dejado de seguir a este usuario',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'followers';
    const page = parseInt(searchParams.get('page') || '1');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    if (type === 'followers') {
      const data = await getFollowers(userId, page);
      return NextResponse.json({ success: true, ...data });
    } else {
      const data = await getFollowing(userId, page);
      return NextResponse.json({ success: true, ...data });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
