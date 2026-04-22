'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { FormInput, FormSection, FormNavigation } from '@/components/ui';
import { LocationPicker, AddressSearchInput } from '@/components/map';
import { PlaceStepLocationContactProps } from '@/types/components';
import { Info } from 'lucide-react';

export function StepLocationContact({ formData, onUpdate, onSubmit, onBack, isLoading }: PlaceStepLocationContactProps) {
  const isValid = formData.address;

  const handleLocationChange = useCallback((lat: number, lng: number, address?: string) => {
    onUpdate('lat', lat);
    onUpdate('lng', lng);
    if (address) {
      onUpdate('address', address);
    }
  }, [onUpdate]);

  const handleAddressSelect = useCallback((lat: number, lng: number, address: string) => {
    onUpdate('lat', lat);
    onUpdate('lng', lng);
    onUpdate('address', address);
  }, [onUpdate]);

  return (
    <div className="space-y-6">
      <FormSection title="Location & Contact">
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">
          Where is this place located?
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Search for the address or click on the map
          </p>
          <AddressSearchInput
            value={formData.address}
            onChange={(value) => onUpdate('address', value)}
            onLocationSelect={handleAddressSelect}
            placeholder="Start typing an address..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pin Location
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Click on the map to set the exact location
          </p>
          <LocationPicker
            lat={formData.lat || 0}
            lng={formData.lng || 0}
            onLocationChange={handleLocationChange}
          />
        </div>

        <FormInput
          label="Website (optional)"
          type="url"
          value={formData.website}
          onChange={(value) => onUpdate('website', value)}
          placeholder="https://..."
          helperText="Official website or social media page"
        />

        <FormInput
          label="Instagram (optional)"
          value={formData.instagram}
          onChange={(value) => onUpdate('instagram', value)}
          placeholder="@username"
          helperText="Instagram handle without the @"
        />

        <FormInput
          label="Notable Features (optional)"
          value={formData.features}
          onChange={(value) => onUpdate('features', value)}
          placeholder="WiFi, outdoor seating, live music..."
          helperText="Separate features with commas (e.g., WiFi, Parking, Pet-friendly)"
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

      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Business Owner?
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              If you own this place, consider{' '}
              <Link href="/pricing" className="underline font-medium">
                claiming your venue profile
              </Link>{' '}
              for more visibility and control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
