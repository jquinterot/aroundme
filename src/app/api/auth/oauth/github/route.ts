import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api-utils';

export async function GET(_request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/oauth/callback/github`;
  
  if (!clientId) {
    return errorResponse('GitHub OAuth client ID is not configured', 500, 'OAUTH_NOT_CONFIGURED');
  }

  const state = Math.random().toString(36).substring(7);
  const scopes = encodeURIComponent('user:email');
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}`;
  
  return NextResponse.redirect(authUrl);
}
