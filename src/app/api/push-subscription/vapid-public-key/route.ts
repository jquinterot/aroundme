import { NextResponse } from 'next/server';
import { VAPID_PUBLIC_KEY } from '@/lib/push-notifications';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: { publicKey: VAPID_PUBLIC_KEY },
    });
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch VAPID public key' },
      { status: 500 }
    );
  }
}
