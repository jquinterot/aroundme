import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/oauth/callback/google`;
  
  if (!clientId) {
    return NextResponse.json(
      { success: false, error: 'Google OAuth not configured' },
      { status: 500 }
    );
  }

  const state = Math.random().toString(36).substring(7);
  const scopes = encodeURIComponent('email profile');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}&state=${state}&access_type=online`;
  
  return NextResponse.redirect(authUrl);
}
