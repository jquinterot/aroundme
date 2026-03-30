'use client';

import Link from 'next/link';
import { FormInput, FormSection, FormNavigation } from '@/components/ui';
import { PlaceStepLocationContactProps } from '@/types/components';

export function StepLocationContact({ formData, onUpdate, onSubmit, onBack, isLoading }: PlaceStepLocationContactProps) {
  const isValid = formData.address;

  return (
    <div className="space-y-6">
      <FormSection title="Location & Contact">
        <FormInput
          label="Address"
          value={formData.address}
          onChange={(value) => onUpdate('address', value)}
          placeholder="Street address, neighborhood"
          required
        />
        <FormInput
          label="Website (optional)"
          type="url"
          value={formData.website}
          onChange={(value) => onUpdate('website', value)}
          placeholder="https://..."
        />
        <FormInput
          label="Instagram (optional)"
          value={formData.instagram}
          onChange={(value) => onUpdate('instagram', value)}
          placeholder="@username"
        />
        <FormInput
          label="Notable Features (optional)"
          value={formData.features}
          onChange={(value) => onUpdate('features', value)}
          placeholder="WiFi, outdoor seating, live music..."
        />
      </FormSection>

      <FormNavigation
        onBack={onBack}
        onSubmit={onSubmit}
        submitLabel={isLoading ? 'Submitting...' : 'Submit Place'}
        isNextDisabled={!isValid}
        isLoading={isLoading}
        colorScheme="teal"
      />

      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> This is a community recommendation.
          If you&apos;re a business owner, consider{' '}
          <Link href="/pricing" className="underline font-medium">
            claiming your venue profile
          </Link>{' '}
          for more visibility.
        </p>
      </div>
    </div>
  );
}
