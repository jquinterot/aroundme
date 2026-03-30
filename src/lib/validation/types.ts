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
