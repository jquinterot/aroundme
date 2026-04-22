'use client';

import { FormInput, FormSelect, CategorySelector, FormButton } from '@/components/ui';
import { EVENT_CATEGORY_OPTIONS } from '@/lib/constants';
import { EventStepBasicInfoProps } from '@/types/components';

export function StepBasicInfo({ formData, cities, onUpdate, onNext }: EventStepBasicInfoProps) {
  const isValid = formData.title && formData.category && formData.description && formData.cityId;

  return (
    <div className="space-y-6" data-testid="create-event-basic-info">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Let&apos;s start with the basics. What&apos;s your event about?
      </p>

      <FormInput
        label="Event Title"
        value={formData.title}
        onChange={(value) => onUpdate('title', value)}
        placeholder="Give your event a catchy title"
        required
        testId="event-title-input"
        helperText="Choose a clear, descriptive title that tells people what to expect"
        maxLength={100}
      />

      <FormSelect
        label="City"
        value={formData.cityId}
        onChange={(value) => onUpdate('cityId', value)}
        options={cities.map((city) => ({ value: city.slug, label: city.name }))}
        required
        testId="event-city-select"
      />

      <CategorySelector
        label="Category"
        value={formData.category}
        onChange={(value) => onUpdate('category', value)}
        options={EVENT_CATEGORY_OPTIONS}
        testId="event-category"
        helperText="Select the category that best describes your event"
      />

      <FormInput
        label="Description"
        value={formData.description}
        onChange={(value) => onUpdate('description', value)}
        placeholder="Tell people what your event is about, what they'll experience, and why they should attend..."
        required
        rows={4}
        testId="event-description-input"
        helperText="Include key details like what to bring, dress code, or age restrictions"
        maxLength={2000}
      />

      <FormButton onClick={onNext} disabled={!isValid} testId="event-basic-next-button">
        Continue to Date & Time
      </FormButton>
    </div>
  );
}
