import { ValidationRule } from '../types';

export function createRSVPValidationRules(): ValidationRule[] {
  return [
    {
      field: 'status',
      required: true,
      type: 'string',
      pattern: /^(going|interested|maybe)$/,
      message: "Status must be 'going', 'interested', or 'maybe'",
    },
  ];
}
