interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'number' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required,
  rows,
  className = ''
}: FormInputProps) {
  const baseClassName = `w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
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
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClassName}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function FormSelect({ label, value, onChange, options, required }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

interface CategorySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CategoryOption[];
  colorScheme?: 'indigo' | 'teal';
}

export function CategorySelector({ 
  label, 
  value, 
  onChange, 
  options,
  colorScheme = 'indigo'
}: CategorySelectorProps) {
  const selectedClass = colorScheme === 'indigo' 
    ? 'border-indigo-500 bg-indigo-50' 
    : 'border-teal-500 bg-teal-50';
  const unselectedClass = 'border-gray-200 hover:border-gray-300';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {options.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              value === cat.value ? selectedClass : unselectedClass
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <p className="text-xs mt-1">{cat.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

interface FormButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  colorScheme?: 'indigo' | 'teal';
  fullWidth?: boolean;
}

export function FormButton({ 
  children, 
  onClick, 
  type = 'button',
  disabled,
  variant = 'primary',
  colorScheme = 'indigo',
  fullWidth = true
}: FormButtonProps) {
  const baseClass = fullWidth ? 'w-full' : '';
  
  if (variant === 'secondary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClass} px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50`}
      >
        {children}
      </button>
    );
  }

  const primaryClass = colorScheme === 'indigo'
    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
    : 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${primaryClass} py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
