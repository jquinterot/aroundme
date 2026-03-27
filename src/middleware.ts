import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10MB for general requests
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB for uploads
const MAX_JSON_SIZE = 1 * 1024 * 1024; // 1MB for JSON requests

export function middleware(request: NextRequest) {
  // Check request size for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const contentLength = request.headers.get('content-length');
    const contentType = request.headers.get('content-type') || '';
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      
      // Different limits for different content types
      if (contentType.includes('application/json') && size > MAX_JSON_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Request body too large (max 1MB for JSON)' },
          { status: 413 }
        );
      }
      
      if (contentType.includes('multipart/form-data') && size > MAX_UPLOAD_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Upload too large (max 50MB)' },
          { status: 413 }
        );
      }
      
      if (size > MAX_BODY_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Request body too large (max 10MB)' },
          { status: 413 }
        );
      }
    }
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://res.cloudinary.com https://images.unsplash.com https://*.googleapis.com;
    connect-src 'self' https://*.tile.openstreetmap.org https://api.resend.com https://api.stripe.com https://*.googleapis.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);

  // CORS Headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
