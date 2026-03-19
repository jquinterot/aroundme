'use client';

import { EventStepLocationProps } from '@/types/components';

export function StepLocation({ formData, onUpdate, onSubmit, onBack, isLoading }: EventStepLocationProps) {
  const isValid = formData.venueName && formData.venueAddress;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Location & Pricing</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Venue Name *
        </label>
        <input
          type="text"
          value={formData.venueName}
          onChange={(e) => onUpdate('venueName', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Parque Simón Bolívar"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Venue Address *
        </label>
        <input
          type="text"
          value={formData.venueAddress}
          onChange={(e) => onUpdate('venueAddress', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Full address"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ticket Price
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onUpdate('isFree', true)}
            className={`flex-1 p-4 rounded-lg border text-center transition-colors ${
              formData.isFree
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <span className="text-2xl">🎉</span>
            <p className="font-medium mt-1">Free Event</p>
          </button>
          <button
            type="button"
            onClick={() => onUpdate('isFree', false)}
            className={`flex-1 p-4 rounded-lg border text-center transition-colors ${
              !formData.isFree
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <span className="text-2xl">💰</span>
            <p className="font-medium mt-1">Paid Event</p>
          </button>
        </div>
      </div>

      {!formData.isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (COP)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onUpdate('price', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (optional)
        </label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => onUpdate('imageUrl', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => onUpdate('tags', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="workshop, networking, free-food"
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
          className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Event'}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Your event will be reviewed before publishing. You&apos;ll be notified once it&apos;s live.
      </p>
    </div>
  );
}
