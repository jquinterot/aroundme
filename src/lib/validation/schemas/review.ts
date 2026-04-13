import { ValidationRule } from '../types';

export function createReviewValidationRules(): ValidationRule[] {
  return [
    {
      field: 'rating',
      required: true,
      type: 'number',
      min: 1,
      max: 5,
      message: 'Rating must be a number between 1 and 5',
    },
    {
      field: 'comment',
      required: false,
      type: 'string',
      maxLength: 2000,
      message: 'Comment must be less than 2000 characters',
    },
  ];
}
