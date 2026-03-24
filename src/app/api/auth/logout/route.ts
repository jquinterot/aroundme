import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'logout');
  }
}
