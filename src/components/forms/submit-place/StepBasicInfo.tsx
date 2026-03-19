'use client';

import { City } from '@/types';
import { PLACE_CATEGORY_OPTIONS } from '@/lib/constants';
import { PlaceStepBasicInfoProps } from '@/types/components';

export function StepBasicInfo({ formData, cities, onUpdate, onNext }: PlaceStepBasicInfoProps) {
  const isValid = formData.name && formData.category && formData.description;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Place Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="e.g., Café Miraflores"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <select
          value={formData.cityId}
          onChange={(e) => onUpdate('cityId', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          {cities.map((city: City) => (
            <option key={city.id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PLACE_CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onUpdate('category', cat.value)}
              className={`p-3 rounded-lg border text-center transition-colors ${
                formData.category === cat.value
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <p className="text-xs mt-1">{cat.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Why is this place great? What makes it special?"
          required
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
