'use client';

import { DateTimeInput, FormSection, FormNavigation } from '@/components/ui/FormComponents';
import { EventStepDateTimeProps } from '@/types/components';

export function StepDateTime({ formData, onUpdate, onNext, onBack }: EventStepDateTimeProps) {
  const isValid = formData.startDate && formData.startTime;

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

      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!isValid}
      />
    </div>
  );
}
