import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<{ success: boolean; response?: NextResponse }> => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (entry && now < entry.resetTime) {
      entry.count++;
      if (entry.count > config.maxRequests) {
        return {
          success: false,
          response: NextResponse.json(
            { success: false, error: 'Too many requests. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)) } }
          ),
        };
      }
    } else {
      rateLimitStore.set(ip, { count: 1, resetTime: now + config.windowMs });
    }

    return { success: true };
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000);
