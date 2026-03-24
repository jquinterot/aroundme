import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/login?error=oauth_failed');
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/oauth/callback/google`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect('/login?error=oauth_not_configured');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Google token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Google user info');
    }

    const googleUser = await userResponse.json();

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      const randomPassword = randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(randomPassword);
      
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split('@')[0],
          password: passwordHash,
          avatarUrl: googleUser.picture || null,
          role: 'user',
          isVerified: true,
        },
      });
    } else if (!user.avatarUrl && googleUser.picture) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: googleUser.picture },
      });
    }

    await createSession(user.id);

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Google OAuth error:', error);
    return handleApiError(error, 'googleOAuth');
  }
}
