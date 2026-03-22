'use client';

import { useState, useEffect } from 'react';
import { Clock, Bell, BellOff } from 'lucide-react';

interface EventCountdownProps {
  dateStart: string;
  eventId?: string;
  eventTitle?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(dateStart: string): TimeLeft {
  const difference = new Date(dateStart).getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

const initialTimeLeft: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0,
};

export function EventCountdown({ dateStart, eventId, compact = false }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft);
  const [hasReminder, setHasReminder] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(dateStart));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(dateStart));
    }, 1000);

    return () => clearInterval(timer);
  }, [dateStart]);

  const handleSetReminder = async () => {
    if (!eventId) return;
    setIsSettingReminder(true);
    try {
      const res = await fetch(`/api/events/${eventId}/reminder`, { method: 'POST' });
      if (res.ok) {
        setHasReminder(true);
      }
    } finally {
      setIsSettingReminder(false);
    }
  };

  const handleRemoveReminder = async () => {
    if (!eventId) return;
    setIsSettingReminder(true);
    try {
      const res = await fetch(`/api/events/${eventId}/reminder?eventId=${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        setHasReminder(false);
      }
    } finally {
      setIsSettingReminder(false);
    }
  };

  if (timeLeft.total <= 0) {
    return (
      <div className={`flex items-center gap-1.5 text-gray-500 dark:text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
        <Clock className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
        Event has ended
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {timeLeft.days > 0 && timeLeft.hours > 0 ? `${String(timeLeft.hours).padStart(2, '0')}h ` : timeLeft.days === 0 && timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ''}
          {timeLeft.days === 0 && timeLeft.hours === 0 ? `${timeLeft.minutes}m` : timeLeft.hours === 0 ? `${String(timeLeft.minutes).padStart(2, '0')}m` : `${String(timeLeft.minutes).padStart(2, '0')}m`}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {timeLeft.days > 0 ? 'Tiempo restante' : 'Comienza pronto'}
        </h3>
        {eventId && (
          <button
            onClick={hasReminder ? handleRemoveReminder : handleSetReminder}
            disabled={isSettingReminder}
            className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            {hasReminder ? (
              <>
                <BellOff className="w-3 h-3" />
                <span className="hidden sm:inline">Quitar</span>
              </>
            ) : (
              <>
                <Bell className="w-3 h-3" />
                <span className="hidden sm:inline">Recordar</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <CountdownUnit value={timeLeft.days} label="Días" show={timeLeft.days > 0} />
        <CountdownUnit value={timeLeft.hours} label="Horas" />
        <CountdownUnit value={timeLeft.minutes} label="Min" />
        <CountdownUnit value={timeLeft.seconds} label="Seg" isSeconds />
      </div>
    </div>
  );
}

function CountdownUnit({ value, label, show = true, isSeconds = false }: { value: number; label: string; show?: boolean; isSeconds?: boolean }) {
  return (
    <div className={`text-center ${!show ? 'opacity-40' : ''}`}>
      <div className={`font-bold tabular-nums ${isSeconds ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} leading-none`}>
        {show ? value : '0'}
      </div>
      <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">{label}</div>
    </div>
  );
}
