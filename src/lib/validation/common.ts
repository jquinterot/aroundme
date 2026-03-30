import { ValidationRule } from './types';

export const commonValidations = {
  id: (field = 'id'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: `${field} must be a valid identifier`,
  }),
  
  email: (field = 'email'): ValidationRule => ({
    field,
    required: true,
    type: 'email',
    maxLength: 254,
  }),
  
  password: (field = 'password'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
  }),
  
  name: (field = 'name'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 255,
  }),
  
  description: (field = 'description'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 5000,
  }),
  
  price: (field = 'price'): ValidationRule => ({
    field,
    required: false,
    type: 'number',
    min: 0,
    max: 1000000,
  }),
  
  coordinates: (latField = 'lat', lngField = 'lng'): ValidationRule[] => [
    {
      field: latField,
      required: true,
      type: 'number',
      min: -90,
      max: 90,
    },
    {
      field: lngField,
      required: true,
      type: 'number',
      min: -180,
      max: 180,
    },
  ],
};
