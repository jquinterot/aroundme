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
      <div className={`flex items-center gap-2 text-gray-500 ${compact ? 'text-sm' : ''}`}>
        <Clock className="w-4 h-4" />
        Event has ended
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours > 0 && `${timeLeft.hours}h `}
          {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {timeLeft.days > 0 ? 'Time until event' : 'Starting soon'}
        </h3>
        {eventId && (
          <button
            onClick={hasReminder ? handleRemoveReminder : handleSetReminder}
            disabled={isSettingReminder}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {hasReminder ? (
              <>
                <BellOff className="w-4 h-4" />
                Remove reminder
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Remind me
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs opacity-80">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs opacity-80">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs opacity-80">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs opacity-80">Seconds</div>
        </div>
      </div>
    </div>
  );
}
