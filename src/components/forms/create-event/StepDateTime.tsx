'use client';

import { useState } from 'react';
import { DateTimeInput, FormSection, FormNavigation } from '@/components/ui/FormComponents';
import { EventStepDateTimeProps } from '@/types/components';
import { RefreshCw } from 'lucide-react';

export function StepDateTime({ formData, onUpdate, onNext, onBack }: EventStepDateTimeProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [occurrenceCount, setOccurrenceCount] = useState(4);

  const isValid = formData.startDate && formData.startTime;

  const handleNext = () => {
    if (isRecurring) {
      onUpdate('recurring', JSON.stringify({
        type: recurrenceType,
        interval: recurrenceInterval,
        occurrences: occurrenceCount,
      }));
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <FormSection title="Date & Time">
        <DateTimeInput
          label="Start Date"
          dateValue={formData.startDate}
          timeValue={formData.startTime}
          onDateChange={(value) => onUpdate('startDate', value)}
          onTimeChange={(value) => onUpdate('startTime', value)}
          required
        />
        <DateTimeInput
          label="End Date"
          dateValue={formData.endDate}
          timeValue={formData.endTime}
          onDateChange={(value) => onUpdate('endDate', value)}
          onTimeChange={(value) => onUpdate('endTime', value)}
        />
      </FormSection>

      <FormSection title="Recurrence">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Repeat this event
            </span>
          </div>
        </label>

        {isRecurring && (
          <div className="mt-4 pl-8 space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Repeat every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                    className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <select
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="daily">day(s)</option>
                    <option value="weekly">week(s)</option>
                    <option value="monthly">month(s)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of events
                </label>
                <input
                  type="number"
                  min="2"
                  max="52"
                  value={occurrenceCount}
                  onChange={(e) => setOccurrenceCount(parseInt(e.target.value) || 2)}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will create {occurrenceCount} events, {recurrenceType === 'daily' ? 'one per day' : recurrenceType === 'weekly' ? 'one per week' : 'one per month'} for the next {recurrenceInterval * (occurrenceCount - 1)} {recurrenceType === 'daily' ? 'days' : recurrenceType === 'weekly' ? 'weeks' : 'months'}.
            </p>
          </div>
        )}
      </FormSection>

      <FormNavigation
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={!isValid}
      />
    </div>
  );
}
