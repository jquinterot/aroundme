'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

interface HoursData {
  [key: string]: { open: string; close: string } | null;
}

interface OperatingHoursEditorProps {
  hours: HoursData;
  onChange: (hours: HoursData) => void;
}

const DAYS = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function OperatingHoursEditor({ hours, onChange }: OperatingHoursEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (day: string, field: 'open' | 'close', value: string) => {
    const current = hours[day] || { open: '09:00', close: '17:00' };
    onChange({
      ...hours,
      [day]: {
        ...current,
        [field]: value,
      },
    });
  };

  const handleToggleDay = (day: string) => {
    if (hours[day]) {
      const newHours = { ...hours };
      delete newHours[day];
      onChange(newHours);
    } else {
      onChange({
        ...hours,
        [day]: { open: '09:00', close: '17:00' },
      });
    }
  };

  const copyToAll = (day: string) => {
    const source = hours[day];
    if (!source) return;
    
    const newHours: HoursData = {};
    DAYS.forEach(d => {
      newHours[d] = { ...source };
    });
    onChange(newHours);
  };

  const is24Hours = (day: string) => {
    const h = hours[day];
    return h && h.open === '00:00' && h.close === '23:59';
  };

  const handle24Hours = (day: string, checked: boolean) => {
    if (checked) {
      onChange({
        ...hours,
        [day]: { open: '00:00', close: '23:59' },
      });
    } else {
      onChange({
        ...hours,
        [day]: { open: '09:00', close: '17:00' },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">Operating Hours</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-4 space-y-3">
            {DAYS.map((day) => {
              const dayHours = hours[day];
              const closed = !dayHours;
              
              return (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-28">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {DAY_LABELS[day]}
                    </span>
                  </div>
                  
                  <label className="flex items-center gap-1 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={!closed}
                      onChange={() => handleToggleDay(day)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    Open
                  </label>

                  {dayHours && (
                    <>
                      <input
                        type="time"
                        value={dayHours.open}
                        onChange={(e) => handleChange(day, 'open', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={dayHours.close}
                        onChange={(e) => handleChange(day, 'close', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      
                      <label className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                        <input
                          type="checkbox"
                          checked={is24Hours(day) ?? false}
                          onChange={(e) => handle24Hours(day, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                        24h
                      </label>
                    </>
                  )}

                  {dayHours && (
                    <button
                      type="button"
                      onClick={() => copyToAll(day)}
                      className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                    >
                      Copy to all
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                const newHours: HoursData = {};
                DAYS.forEach(day => {
                  newHours[day] = { open: '09:00', close: '17:00' };
                });
                onChange(newHours);
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Set all days 9am - 5pm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
