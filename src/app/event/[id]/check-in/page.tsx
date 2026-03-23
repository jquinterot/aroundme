'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { QRScanner } from '@/components/checkin';
import { Loader2 } from 'lucide-react';

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const eventId = (params.id as string) || '';

  const [eventTitle, setEventTitle] = useState('');
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEventTitle(data.data.title);
          }
          setEventLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching event:', error);
          setEventLoading(false);
        });
    }
  }, [eventId]);

  const handleScan = async (token: string) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, token }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message || 'Check-in exitoso' };
      } else {
        return { success: false, message: data.error || 'Error en check-in' };
      }
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const handleClose = () => {
    router.push(`/event/${eventId}`);
  };

  if (authLoading || eventLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user || !eventTitle) {
    return null;
  }

  return (
    <QRScanner
      eventId={eventId}
      eventTitle={eventTitle}
      onScan={handleScan}
      onClose={handleClose}
    />
  );
}
