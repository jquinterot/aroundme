'use client';

import { FormInput, FormSelect, CategorySelector, FormButton } from '@/components/ui/FormComponents';
import { PLACE_CATEGORY_OPTIONS } from '@/lib/constants';
import { PlaceStepBasicInfoProps } from '@/types/components';

export function StepBasicInfo({ formData, cities, onUpdate, onNext }: PlaceStepBasicInfoProps) {
  const isValid = formData.name && formData.cityId && formData.category && formData.description;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>

      <FormInput
        label="Place Name"
        value={formData.name}
        onChange={(value) => onUpdate('name', value)}
        placeholder="e.g., Café Miraflores"
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
        options={PLACE_CATEGORY_OPTIONS}
        colorScheme="teal"
      />

      <FormInput
        label="Description"
        value={formData.description}
        onChange={(value) => onUpdate('description', value)}
        placeholder="Why is this place great? What makes it special?"
        required
        rows={4}
      />

      <FormButton onClick={onNext} disabled={!isValid} colorScheme="teal">
        Continue
      </FormButton>
    </div>
  );
}
