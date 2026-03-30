import { ValidationRule } from '../types';

export function createPlaceValidationRules(): ValidationRule[] {
  return [
    {
      field: 'citySlug',
      required: true,
      type: 'string',
      minLength: 1,
    },
    {
      field: 'name',
      required: true,
      type: 'string',
      minLength: 2,
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
      pattern: /^(restaurant|cafe|bar|club|park|museum|shopping|hotel|coworking|other)$/,
      message: 'Invalid category',
    },
    {
      field: 'address',
      required: true,
      type: 'string',
      minLength: 5,
      maxLength: 500,
    },
    {
      field: 'lat',
      required: false,
      type: 'number',
      min: -90,
      max: 90,
    },
    {
      field: 'lng',
      required: false,
      type: 'number',
      min: -180,
      max: 180,
    },
    {
      field: 'website',
      required: false,
      type: 'url',
    },
    {
      field: 'instagram',
      required: false,
      type: 'string',
      pattern: /^[a-zA-Z0-9._]+$/,
      message: 'Invalid Instagram username',
    },
    {
      field: 'imageUrl',
      required: false,
      type: 'url',
    },
  ];
}
