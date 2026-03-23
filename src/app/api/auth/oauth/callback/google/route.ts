import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/auth';
import { randomBytes } from 'crypto';

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

    // Exchange code for tokens
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
      throw new Error('Failed to exchange code for tokens');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const googleUser = await userResponse.json();

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Generate a random password for OAuth users (they can't login with password)
      const randomPassword = randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(randomPassword);
      
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split('@')[0],
          password: passwordHash,
          avatarUrl: googleUser.picture || null,
          role: 'user',
          isVerified: true, // Google users are pre-verified
        },
      });
    } else if (!user.avatarUrl && googleUser.picture) {
      // Update avatar if not set
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: googleUser.picture },
      });
    }

    await createSession(user.id);

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect('/login?error=oauth_failed');
  }
}
