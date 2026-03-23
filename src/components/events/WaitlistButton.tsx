'use client';

import { useState } from 'react';
import { Clock, Users, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WaitlistButtonProps {
  eventId: string;
  eventTitle?: string;
  maxAttendees?: number | null;
  currentAttendees?: number;
  userPosition?: number | null;
}

export function WaitlistButton({
  eventId,
  eventTitle: _,
  maxAttendees,
  currentAttendees = 0,
  userPosition,
}: WaitlistButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<number | null>(userPosition || null);
  const [, setError] = useState('');

  const availableSpots = maxAttendees ? maxAttendees - currentAttendees : null;
  const isOnWaitlist = position !== null;

  const handleJoinWaitlist = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (data.success) {
        setPosition(data.data.position);
      } else {
        setError(data.error || 'Error al unirse a la lista de espera');
      }
    } catch {
      setError('Error al unirse a la lista de espera');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveWaitlist = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/waitlist?eventId=${eventId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setPosition(null);
      } else {
        setError(data.error || 'Error al salir de la lista de espera');
      }
    } catch {
      setError('Error al salir de la lista de espera');
    } finally {
      setLoading(false);
    }
  };

  if (!maxAttendees) {
    return null;
  }

  if (availableSpots !== null && availableSpots <= 0 && !isOnWaitlist) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          <div>
            <p className="font-medium text-orange-900">Evento Agotado</p>
            <p className="text-sm text-orange-700">
              Únete a la lista de espera para ser notificado cuando haya lugares disponibles
            </p>
          </div>
        </div>
        <button
          onClick={handleJoinWaitlist}
          disabled={loading}
          className="mt-4 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Unirme a Lista de Espera
            </>
          )}
        </button>
      </div>
    );
  }

  if (isOnWaitlist) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-indigo-900">Estás en la lista de espera</p>
            <p className="text-sm text-indigo-700">
              Posición #{position} • Te notificaremos cuando haya lugares
            </p>
          </div>
        </div>
        <button
          onClick={handleLeaveWaitlist}
          disabled={loading}
          className="mt-4 w-full py-3 bg-white text-indigo-600 border border-indigo-300 rounded-xl font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            'Salir de Lista de Espera'
          )}
        </button>
      </div>
    );
  }

  if (availableSpots !== null && availableSpots <= 5) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-orange-600" />
          <div>
            <p className="font-medium text-orange-900">
              ¡Solo {availableSpots} lugares disponibles!
            </p>
            <p className="text-sm text-orange-700">
              {maxAttendees} capacidad total
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface WaitlistCountProps {
  eventId: string;
}

export function WaitlistCount({ eventId }: WaitlistCountProps) {
  const [count, setCount] = useState(0);

  useState(() => {
    fetch(`/api/waitlist?eventId=${eventId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCount(data.data.length);
        }
      })
      .catch(console.error);
  });

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      {count} en lista de espera
    </span>
  );
}
