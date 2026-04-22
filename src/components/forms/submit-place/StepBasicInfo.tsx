'use client';

import { FormInput, FormSelect, CategorySelector, FormButton } from '@/components/ui';
import { PLACE_CATEGORY_OPTIONS } from '@/lib/constants';
import { PlaceStepBasicInfoProps } from '@/types/components';

export function StepBasicInfo({ formData, cities, onUpdate, onNext }: PlaceStepBasicInfoProps) {
  const isValid = formData.name && formData.cityId && formData.category && formData.description;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tell us about the place you want to recommend
      </p>

      <FormInput
        label="Place Name"
        value={formData.name}
        onChange={(value) => onUpdate('name', value)}
        placeholder="e.g., Café Miraflores"
        required
        helperText="The official or commonly known name of the place"
        maxLength={100}
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
        helperText="What type of place is this?"
      />

      <FormInput
        label="Description"
        value={formData.description}
        onChange={(value) => onUpdate('description', value)}
        placeholder="Why is this place great? What makes it special?"
        required
        rows={4}
        helperText="Share what makes this place worth visiting - atmosphere, signature dishes, unique features..."
        maxLength={1000}
      />

      <FormButton onClick={onNext} disabled={!isValid} colorScheme="teal">
        Continue to Location
      </FormButton>
    </div>
  );
}
