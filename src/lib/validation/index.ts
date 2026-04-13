import { NextRequest } from 'next/server';
import { ValidationRule, ValidationErrorItem } from './types';
import { validateData } from './core';

export type { ValidationRule, ValidationErrorItem, ValidationResult } from './types';
export { ValidationError } from './types';
export { validateData, formatValidationErrors } from './core';
export { commonValidations } from './common';

// Schema exports
export { createEventValidationRules } from './schemas/event';
export { createPlaceValidationRules } from './schemas/place';
export { createUserRegistrationRules } from './schemas/user';
export { createRSVPValidationRules } from './schemas/rsvp';
export { createActivityBookingRules } from './schemas/activity';
export { createReviewValidationRules } from './schemas/review';

/**
 * Validates request body and returns parsed data or error response
 */
export async function validateRequestBody(
  request: NextRequest,
  rules: ValidationRule[],
  context?: string
): Promise<{ success: true; data: Record<string, unknown> } | { success: false; errors: ValidationErrorItem[] }> {
  try {
    const body = await request.json();
    
    const validation = validateData(body, rules);
    
    if (!validation.isValid) {
      // Log detailed validation errors
      console.error(`[${context || 'API'}] Validation failed:`, {
        errors: validation.errors,
        receivedFields: Object.keys(body),
        timestamp: new Date().toISOString(),
      });
      
      return { success: false, errors: validation.errors };
    }
    
    return { success: true, data: validation.sanitizedData };
  } catch (error) {
    console.error(`[${context || 'API'}] Failed to parse request body:`, error);
    return {
      success: false,
      errors: [{
        field: 'body',
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
      }],
    };
  }
}
