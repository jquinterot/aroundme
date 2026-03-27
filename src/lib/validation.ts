import { NextRequest } from 'next/server';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorItem[];
  sanitizedData: Record<string, unknown>;
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates data against a set of rules
 */
export function validateData(
  data: Record<string, unknown>,
  rules: ValidationRule[]
): ValidationResult {
  const errors: ValidationErrorItem[] = [];
  const sanitizedData: Record<string, unknown> = {};

  for (const rule of rules) {
    const value = data[rule.field];
    const fieldErrors = validateField(value, rule);
    
    if (fieldErrors.length > 0) {
      errors.push(...fieldErrors);
    } else {
      // Only add to sanitized data if validation passed
      sanitizedData[rule.field] = sanitizeValue(value, rule.type);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

function validateField(value: unknown, rule: ValidationRule): ValidationErrorItem[] {
  const errors: ValidationErrorItem[] = [];

  // Check required
  if (rule.required) {
    if (value === undefined || value === null || value === '') {
      errors.push({
        field: rule.field,
        message: rule.message || `The field '${rule.field}' is required`,
        code: 'REQUIRED_FIELD_MISSING',
      });
      return errors;
    }
  }

  // Skip further validation if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors;
  }

  // Check type
  if (rule.type) {
    const typeError = validateType(value, rule.field, rule.type);
    if (typeError) {
      errors.push(typeError);
      return errors;
    }
  }

  // String validations
  if (rule.type === 'string' || typeof value === 'string') {
    const strValue = value as string;

    if (rule.minLength !== undefined && strValue.length < rule.minLength) {
      errors.push({
        field: rule.field,
        message: rule.message || `The field '${rule.field}' must be at least ${rule.minLength} characters`,
        code: 'MIN_LENGTH_EXCEEDED',
      });
    }

    if (rule.maxLength !== undefined && strValue.length > rule.maxLength) {
      errors.push({
        field: rule.field,
        message: rule.message || `The field '${rule.field}' must be at most ${rule.maxLength} characters`,
        code: 'MAX_LENGTH_EXCEEDED',
      });
    }

    if (rule.pattern && !rule.pattern.test(strValue)) {
      errors.push({
        field: rule.field,
        message: rule.message || `The field '${rule.field}' format is invalid`,
        code: 'PATTERN_MISMATCH',
      });
    }
  }

  // Number validations
  if (rule.type === 'number' || typeof value === 'number') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value as number;

    if (isNaN(numValue)) {
      errors.push({
        field: rule.field,
        message: rule.message || `The field '${rule.field}' must be a valid number`,
        code: 'INVALID_NUMBER',
      });
    } else {
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push({
          field: rule.field,
          message: rule.message || `The field '${rule.field}' must be at least ${rule.min}`,
          code: 'MIN_VALUE_EXCEEDED',
        });
      }

      if (rule.max !== undefined && numValue > rule.max) {
        errors.push({
          field: rule.field,
          message: rule.message || `The field '${rule.field}' must be at most ${rule.max}`,
          code: 'MAX_VALUE_EXCEEDED',
        });
      }
    }
  }

  // Custom validation
  if (rule.custom && !rule.custom(value)) {
    errors.push({
      field: rule.field,
      message: rule.message || `The field '${rule.field}' is invalid`,
      code: 'CUSTOM_VALIDATION_FAILED',
    });
  }

  return errors;
}

function validateType(
  value: unknown,
  field: string,
  type: string
): ValidationErrorItem | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return {
          field,
          message: `The field '${field}' must be a string`,
          code: 'INVALID_TYPE_STRING',
        };
      }
      break;
    case 'number':
      if (typeof value !== 'number' && (typeof value !== 'string' || isNaN(parseFloat(value as string)))) {
        return {
          field,
          message: `The field '${field}' must be a number`,
          code: 'INVALID_TYPE_NUMBER',
        };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return {
          field,
          message: `The field '${field}' must be a boolean`,
          code: 'INVALID_TYPE_BOOLEAN',
        };
      }
      break;
    case 'date':
      if (!(value instanceof Date) && (typeof value !== 'string' || isNaN(Date.parse(value as string)))) {
        return {
          field,
          message: `The field '${field}' must be a valid date`,
          code: 'INVALID_TYPE_DATE',
        };
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== 'string' || !emailRegex.test(value)) {
        return {
          field,
          message: `The field '${field}' must be a valid email address`,
          code: 'INVALID_TYPE_EMAIL',
        };
      }
      break;
    case 'url':
      try {
        if (typeof value !== 'string' || !new URL(value)) {
          throw new Error('Invalid URL');
        }
      } catch {
        return {
          field,
          message: `The field '${field}' must be a valid URL`,
          code: 'INVALID_TYPE_URL',
        };
      }
      break;
  }
  return null;
}

function sanitizeValue(value: unknown, type?: string): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  switch (type) {
    case 'string':
      return String(value).trim();
    case 'number':
      return typeof value === 'number' ? value : parseFloat(value as string);
    case 'boolean':
      return Boolean(value);
    case 'date':
      return value instanceof Date ? value : new Date(value as string);
    default:
      return value;
  }
}

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

/**
 * Predefined validation rules for common fields
 */
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

/**
 * Formats validation errors for API response
 */
export function formatValidationErrors(errors: ValidationErrorItem[]): string {
  if (errors.length === 1) {
    return errors[0].message;
  }
  return `${errors.length} validation errors: ${errors.map(e => e.message).join('; ')}`;
}

/**
 * Creates a validation schema for events
 */
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

/**
 * Creates a validation schema for places
 */
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

/**
 * Creates a validation schema for user registration
 */
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

/**
 * Creates a validation schema for RSVP
 */
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

/**
 * Creates a validation schema for activity bookings
 */
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
