'use client';

import { useCallback } from 'react';
import { FormInput, ToggleOption, FormSection, FormNavigation } from '@/components/ui';
import { LocationPicker, AddressSearchInput } from '@/components/map';
import { EventStepLocationProps } from '@/types/components';
import { Info } from 'lucide-react';

export function StepLocation({ formData, onUpdate, onSubmit, onBack, isLoading }: EventStepLocationProps) {
  const isValid = formData.venueName && formData.venueAddress;

  const handleLocationChange = useCallback((lat: number, lng: number, address?: string) => {
    onUpdate('venueLat', lat);
    onUpdate('venueLng', lng);
    if (address) {
      onUpdate('venueAddress', address);
    }
  }, [onUpdate]);

  const handleAddressSelect = useCallback((lat: number, lng: number, address: string) => {
    onUpdate('venueLat', lat);
    onUpdate('venueLng', lng);
    onUpdate('venueAddress', address);
  }, [onUpdate]);

  return (
    <div className="space-y-6">
      <FormSection title="Location & Pricing">
        <FormInput
          label="Venue Name"
          value={formData.venueName}
          onChange={(value) => onUpdate('venueName', value)}
          placeholder="e.g., Parque Simón Bolívar"
          required
          helperText="The name of the venue or location where the event will take place"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Venue Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Search for an address or click on the map to set the location
          </p>
          <AddressSearchInput
            value={formData.venueAddress}
            onChange={(value) => onUpdate('venueAddress', value)}
            onLocationSelect={handleAddressSelect}
            placeholder="Start typing an address..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pin Location
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Click on the map to fine-tune the exact location
          </p>
          <LocationPicker
            lat={formData.venueLat || 0}
            lng={formData.venueLng || 0}
            onLocationChange={handleLocationChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ticket Price
          </label>
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
            helperText="Price in Colombian Pesos (COP)"
          />
        )}

        <FormInput
          label="Image URL (optional)"
          type="url"
          value={formData.imageUrl}
          onChange={(value) => onUpdate('imageUrl', value)}
          placeholder="https://..."
          helperText="A link to an image that represents your event"
        />

        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                Image Guidelines
              </p>
              <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                <li>• Use high-quality images (minimum 1200x630px recommended)</li>
                <li>• Landscape images work best (16:9 ratio)</li>
                <li>• Include the event venue or key visual elements</li>
                <li>• Avoid heavy text overlay on images</li>
              </ul>
            </div>
          </div>
        </div>

        <FormInput
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={(value) => onUpdate('tags', value)}
          placeholder="workshop, networking, free-food"
          helperText="Add relevant tags to help people find your event"
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
