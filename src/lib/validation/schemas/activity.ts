import { ValidationRule } from '../types';

export function createActivityBookingRules(): ValidationRule[] {
  return [
    {
      field: 'guestName',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
    },
    {
      field: 'guestEmail',
      required: true,
      type: 'email',
    },
    {
      field: 'guestPhone',
      required: false,
      type: 'string',
      pattern: /^[+]?[\d\s-()]+$/,
      message: 'Invalid phone number format',
    },
    {
      field: 'tickets',
      required: true,
      type: 'number',
      min: 1,
      max: 50,
    },
    {
      field: 'notes',
      required: false,
      type: 'string',
      maxLength: 1000,
    },
  ];
}
