'use client';

import Link from 'next/link';

interface StepLocationContactFormData {
  address: string;
  website: string;
  instagram: string;
  features: string;
}

interface StepLocationContactProps {
  formData: StepLocationContactFormData;
  onUpdate: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function StepLocationContact({ formData, onUpdate, onSubmit, onBack, isLoading }: StepLocationContactProps) {
  const isValid = formData.address;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Location & Contact</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onUpdate('address', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Street address, neighborhood"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website (optional)
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => onUpdate('website', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instagram (optional)
        </label>
        <input
          type="text"
          value={formData.instagram}
          onChange={(e) => onUpdate('instagram', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="@username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notable Features (optional)
        </label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => onUpdate('features', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="WiFi, outdoor seating, live music..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading || !isValid}
          className="flex-1 bg-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Place'}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
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
