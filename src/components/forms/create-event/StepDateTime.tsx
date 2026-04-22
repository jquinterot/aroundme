'use client';

import { useState } from 'react';
import { DateTimeInput, FormSection, FormNavigation } from '@/components/ui';
import { EventStepDateTimeProps } from '@/types/components';
import { RefreshCw, Info } from 'lucide-react';

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
    <div className="space-y-6" data-testid="create-event-datetime">
      <FormSection title="Date & Time">
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">
          When will your event take place?
        </p>

        <DateTimeInput
          label="Start Date & Time"
          dateValue={formData.startDate}
          timeValue={formData.startTime}
          onDateChange={(value) => onUpdate('startDate', value)}
          onTimeChange={(value) => onUpdate('startTime', value)}
          required
          helperText="When does the event begin?"
        />

        <div className="mt-4">
          <DateTimeInput
            label="End Date & Time (Optional)"
            dateValue={formData.endDate}
            timeValue={formData.endTime}
            onDateChange={(value) => onUpdate('endDate', value)}
            onTimeChange={(value) => onUpdate('endTime', value)}
            helperText="Leave empty if it's a single-day event or the end time is flexible"
          />
        </div>
      </FormSection>

      <FormSection title="Recurrence">
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
            data-testid="event-recurring-checkbox"
          />
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Repeat this event
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Create multiple events at regular intervals
              </p>
            </div>
          </div>
        </label>

        {isRecurring && (
          <div className="mt-4 pl-8 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-800 ml-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    data-testid="event-recurrence-interval"
                  />
                  <select
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    data-testid="event-recurrence-type"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  data-testid="event-occurrence-count"
                />
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                This will create {occurrenceCount} events, {recurrenceType === 'daily' ? 'one per day' : recurrenceType === 'weekly' ? 'one per week' : 'one per month'} for the next {recurrenceInterval * (occurrenceCount - 1)} {recurrenceType === 'daily' ? 'days' : recurrenceType === 'weekly' ? 'weeks' : 'months'}.
              </p>
            </div>
          </div>
        )}
      </FormSection>

      <FormNavigation
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={!isValid}
        nextLabel="Continue to Location"
        backLabel="Back"
        backTestId="event-datetime-back-button"
        nextTestId="event-datetime-next-button"
      />
    </div>
  );
}
