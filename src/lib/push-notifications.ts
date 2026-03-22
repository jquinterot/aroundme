import webpush from 'web-push';

let isConfigured = false;

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  isConfigured = true;
}

export { webpush };

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';

export function isPushConfigured() {
  return isConfigured;
}

export async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; icon?: string; url?: string }
) {
  if (!isConfigured) {
    console.warn('Push notifications not configured - VAPID keys not set');
    return { success: false, error: 'Push notifications not configured' };
  }

  try {
    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    if (err.statusCode === 404 || err.statusCode === 410) {
      return { success: false, deleted: true };
    }
    return { success: false, error: err.message };
  }
}
