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
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/oauth/callback/github`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect('/login?error=oauth_not_configured');
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('GitHub token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received from GitHub');
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch GitHub user info');
    }

    const githubUser = await userResponse.json();

    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    if (!email) {
      return NextResponse.redirect('/login?error=oauth_no_email');
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const randomPassword = randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(randomPassword);
      
      user = await prisma.user.create({
        data: {
          email,
          name: githubUser.name || githubUser.login,
          password: passwordHash,
          avatarUrl: githubUser.avatar_url || null,
          role: 'user',
          isVerified: true,
        },
      });
    } else if (!user.avatarUrl && githubUser.avatar_url) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: githubUser.avatar_url },
      });
    }

    await createSession(user.id);

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return handleApiError(error, 'githubOAuth');
  }
}
