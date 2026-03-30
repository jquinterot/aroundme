import { ValidationRule } from '../types';

export function createEventValidationRules(): ValidationRule[] {
  return [
    {
      field: 'citySlug',
      required: true,
      type: 'string',
      minLength: 1,
    },
    {
      field: 'title',
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 200,
    },
    {
      field: 'description',
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 5000,
    },
    {
      field: 'category',
      required: true,
      type: 'string',
      pattern: /^(music|food|sports|art|tech|community|nightlife|outdoor|education|other)$/,
      message: 'Invalid category',
    },
    {
      field: 'venueName',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 200,
    },
    {
      field: 'venueAddress',
      required: true,
      type: 'string',
      minLength: 5,
      maxLength: 500,
    },
    {
      field: 'venueLat',
      required: false,
      type: 'number',
      min: -90,
      max: 90,
    },
    {
      field: 'venueLng',
      required: false,
      type: 'number',
      min: -180,
      max: 180,
    },
    {
      field: 'startDate',
      required: true,
      type: 'string',
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'startDate must be in YYYY-MM-DD format',
    },
    {
      field: 'startTime',
      required: true,
      type: 'string',
      pattern: /^\d{2}:\d{2}$/,
      message: 'startTime must be in HH:MM format',
    },
    {
      field: 'endDate',
      required: false,
      type: 'string',
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'endDate must be in YYYY-MM-DD format',
    },
    {
      field: 'endTime',
      required: false,
      type: 'string',
      pattern: /^\d{2}:\d{2}$/,
      message: 'endTime must be in HH:MM format',
    },
    {
      field: 'isFree',
      required: true,
      type: 'boolean',
    },
    {
      field: 'price',
      required: false,
      type: 'number',
      min: 0,
    },
    {
      field: 'imageUrl',
      required: false,
      type: 'url',
    },
    {
      field: 'tags',
      required: false,
      type: 'string',
      maxLength: 500,
    },
  ];
}
