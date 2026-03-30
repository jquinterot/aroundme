interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'number' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  testId?: string;
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
  testId
}: FormInputProps) {
  const baseClassName = `w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`;
  const dataProps = testId ? { 'data-testid': testId } : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={baseClassName}
          placeholder={placeholder}
          required={required}
          {...dataProps}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClassName}
          placeholder={placeholder}
          required={required}
          {...dataProps}
        />
      )}
    </div>
  );
}
