'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function TimePicker({ value, onChange, label, required }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const timeValue = value ? new Date(`2000-01-01T${value}`) : null;

  const handleChange = (date: Date | null) => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    } else {
      onChange('');
    }
    setIsOpen(false);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={timeValue}
          onChange={handleChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          customInput={
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left flex items-center justify-between gap-2 hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className={value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                {value || 'Select time'}
              </span>
              <Clock className="w-5 h-5 text-gray-400" />
            </button>
          }
        />
      </div>
    </div>
  );
}
