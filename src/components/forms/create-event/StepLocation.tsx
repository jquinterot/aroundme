'use client';

import { FormInput, ToggleOption, FormSection, FormNavigation } from '@/components/ui/FormComponents';
import { EventStepLocationProps } from '@/types/components';

export function StepLocation({ formData, onUpdate, onSubmit, onBack, isLoading }: EventStepLocationProps) {
  const isValid = formData.venueName && formData.venueAddress;

  return (
    <div className="space-y-6">
      <FormSection title="Location & Pricing">
        <FormInput
          label="Venue Name"
          value={formData.venueName}
          onChange={(value) => onUpdate('venueName', value)}
          placeholder="e.g., Parque Simón Bolívar"
          required
        />
        <FormInput
          label="Venue Address"
          value={formData.venueAddress}
          onChange={(value) => onUpdate('venueAddress', value)}
          placeholder="Full address"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ticket Price</label>
          <ToggleOption
            options={[
              { value: true, label: 'Free', icon: '🎉', description: 'Free Event' },
              { value: false, label: 'Paid', icon: '💰', description: 'Paid Event' },
            ]}
            selected={formData.isFree}
            onChange={(value) => onUpdate('isFree', value)}
          />
        </div>

        {!formData.isFree && (
          <FormInput
            label="Price (COP)"
            type="number"
            value={formData.price}
            onChange={(value) => onUpdate('price', value)}
            placeholder="0"
          />
        )}

        <FormInput
          label="Image URL (optional)"
          type="url"
          value={formData.imageUrl}
          onChange={(value) => onUpdate('imageUrl', value)}
          placeholder="https://..."
        />
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">
            <strong>Image Guidelines:</strong>
          </p>
          <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
            <li>• Use high-quality images (minimum 1200x630px recommended)</li>
            <li>• Landscape images work best (16:9 ratio)</li>
            <li>• Include the event venue or key visual elements</li>
            <li>• Avoid heavy text overlay on images</li>
          </ul>
        </div>
        <FormInput
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={(value) => onUpdate('tags', value)}
          placeholder="workshop, networking, free-food"
        />
      </FormSection>

      <FormNavigation
        onBack={onBack}
        onSubmit={onSubmit}
        submitLabel={isLoading ? 'Submitting...' : 'Submit Event'}
        isNextDisabled={!isValid}
        isLoading={isLoading}
      />

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your event will be reviewed before publishing. You&apos;ll be notified once it&apos;s live.
      </p>
    </div>
  );
}
