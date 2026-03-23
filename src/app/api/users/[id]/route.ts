import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '@/lib/social';

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
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Por favor inicia sesión' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, avatarUrl, website, instagram, cityId } = body;

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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
