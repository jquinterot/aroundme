'use client';

import { FormInput, FormSelect, CategorySelector, FormButton } from '@/components/ui/FormComponents';
import { EVENT_CATEGORY_OPTIONS } from '@/lib/constants';
import { EventStepBasicInfoProps } from '@/types/components';

export function StepBasicInfo({ formData, cities, onUpdate, onNext }: EventStepBasicInfoProps) {
  const isValid = formData.title && formData.category && formData.description;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

      <FormInput
        label="Event Title"
        value={formData.title}
        onChange={(value) => onUpdate('title', value)}
        placeholder="Give your event a catchy title"
        required
      />

      <FormSelect
        label="City"
        value={formData.cityId}
        onChange={(value) => onUpdate('cityId', value)}
        options={cities.map((city) => ({ value: city.slug, label: city.name }))}
        required
      />

      <CategorySelector
        label="Category"
        value={formData.category}
        onChange={(value) => onUpdate('category', value)}
        options={EVENT_CATEGORY_OPTIONS}
      />

      <FormInput
        label="Description"
        value={formData.description}
        onChange={(value) => onUpdate('description', value)}
        placeholder="Tell people what your event is about..."
        required
        rows={4}
      />

      <FormButton onClick={onNext} disabled={!isValid}>
        Continue
      </FormButton>
    </div>
  );
}
