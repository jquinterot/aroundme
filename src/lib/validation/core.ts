import { ValidationRule, ValidationErrorItem, ValidationResult } from './types';

export type { ValidationRule, ValidationErrorItem, ValidationResult } from './types';
export { ValidationError } from './types';

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
      sanitizedData[rule.field] = sanitizeValue(value, rule.type);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

export function formatValidationErrors(errors: ValidationErrorItem[]): string {
  if (errors.length === 1) {
    return errors[0].message;
  }
  return `${errors.length} validation errors: ${errors.map(e => e.message).join('; ')}`;
}
