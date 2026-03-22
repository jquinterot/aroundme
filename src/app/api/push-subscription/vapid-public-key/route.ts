import { NextResponse } from 'next/server';
import { VAPID_PUBLIC_KEY } from '@/lib/push-notifications';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { publicKey: VAPID_PUBLIC_KEY },
  });
}
