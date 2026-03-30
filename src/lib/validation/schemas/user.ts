import { ValidationRule } from '../types';

export function createUserRegistrationRules(): ValidationRule[] {
  return [
    {
      field: 'email',
      required: true,
      type: 'email',
      maxLength: 254,
    },
    {
      field: 'password',
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 128,
    },
    {
      field: 'name',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
    },
  ];
}
