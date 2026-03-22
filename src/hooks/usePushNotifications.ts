'use client';

import { useState, useEffect, useCallback } from 'react';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription.toJSON() as PushSubscriptionData);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    } else {
      setIsSupported(false);
      setLoading(false);
    }
  }, [checkExistingSubscription]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;

    try {
      const res = await fetch('/api/push-subscription/vapid-public-key');
      const { data } = await res.json();

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: data.publicKey,
      });

      const subscriptionData = sub.toJSON() as PushSubscriptionData;

      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      });

      setSubscription(subscriptionData);
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
      }

      await fetch('/api/push-subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }, [subscription]);

  return {
    subscription,
    isSupported,
    loading,
    subscribe,
    unsubscribe,
    isSubscribed: !!subscription,
  };
}
