'use client';

import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';

interface DateTimeInputProps {
  label: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  required?: boolean;
  helperText?: string;
}

export function DateTimeInput({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  required,
  helperText,
}: DateTimeInputProps) {
  const getCombinedDate = () => {
    if (!dateValue) return null;
    const [year, month, day] = dateValue.split('-').map(Number);
    if (!timeValue) {
      return new Date(year, month - 1, day, 12, 0);
    }
    const [hours, minutes] = timeValue.split(':').map(Number);
    return new Date(year, month - 1, day, hours || 12, minutes || 0);
  };

  const handleChange = (date: Date | null) => {
    if (!date) return;
    const d = dayjs(date);
    onDateChange(d.format('YYYY-MM-DD'));
    onTimeChange(d.format('HH:mm'));
  };

  const getQuickDates = () => {
    const today = dayjs();
    const tomorrow = today.add(1, 'day');
    const nextSaturday = today.day(6).add(7, 'day');
    const nextWeek = today.add(7, 'day');

    return [
      { label: 'Today', date: today.toDate() },
      { label: 'Tomorrow', date: tomorrow.toDate() },
      { label: 'This Saturday', date: nextSaturday.toDate() },
      { label: 'Next Week', date: nextWeek.toDate() },
    ];
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{helperText}</p>
      )}

      <DateTimePicker
        value={getCombinedDate()}
        onChange={handleChange}
        minDate={new Date()}
        placeholder="Select date and time"
        valueFormat="EEE, MMM d, yyyy • h:mm a"
        styles={{
          input: {
            backgroundColor: 'transparent',
            borderColor: 'rgb(209, 213, 219)',
          },
        }}
        classNames={{
          input: 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer',
        }}
      />

      {!dateValue && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">Quick pick:</span>
          {getQuickDates().map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onDateChange(dayjs(item.date).format('YYYY-MM-DD'))}
              className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}