interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'number' | 'date' | 'time' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  testId?: string;
  helperText?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  rows,
  className = '',
  testId,
  helperText,
  maxLength,
  error,
  disabled,
}: FormInputProps) {
  const hasError = !!error;
  const borderColor = hasError
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500';
  const baseClassName = `w-full px-4 py-2.5 border ${borderColor} rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed ${className}`;
  const dataProps = testId ? { 'data-testid': testId } : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{helperText}</p>
      )}
      {rows ? (
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={baseClassName}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            disabled={disabled}
            {...dataProps}
          />
          {maxLength && (
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClassName}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          {...dataProps}
        />
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
