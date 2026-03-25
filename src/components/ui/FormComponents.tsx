import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const baseClassName = `w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`;

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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400' 
    : 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400';
  const unselectedClass = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {options.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`p-2 sm:p-3 rounded-lg border text-center transition-all overflow-hidden ${
              value === cat.value ? selectedClass : unselectedClass
            } dark:bg-gray-800 dark:text-gray-200`}
          >
            <span className="text-lg sm:text-xl block">{cat.icon}</span>
            <p className="text-[10px] sm:text-xs mt-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">{cat.label}</p>
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

interface DateTimeInputProps {
  label: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  required?: boolean;
}

export function DateTimeInput({ 
  label, 
  dateValue, 
  timeValue, 
  onDateChange, 
  onTimeChange, 
  required 
}: DateTimeInputProps) {
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (date: Date | null) => {
    if (date) onDateChange(formatDate(date));
  };

  const handleTimeChange = (date: Date | null) => {
    if (date) onTimeChange(formatTime(date));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
          <DatePicker
            selected={parseDate(dateValue)}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholderText="Select date"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label>
          <DatePicker
            selected={parseTime(timeValue)}
            onChange={handleTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="HH:mm"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholderText="Select time"
          />
        </div>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  options: {
    value: boolean;
    label: string;
    icon: string;
    description: string;
  }[];
  selected: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleOption({ options, selected, onChange }: ToggleOptionProps) {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 p-4 rounded-lg border text-center transition-colors ${
            selected === option.value
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="text-2xl">{option.icon}</span>
          <p className="font-medium mt-1 text-gray-900 dark:text-gray-100">{option.description}</p>
        </button>
      ))}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {children}
    </div>
  );
}

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  colorScheme?: 'indigo' | 'teal';
}

export function FormNavigation({ 
  onBack, 
  onNext, 
  onSubmit, 
  nextLabel = 'Continue',
  backLabel = 'Back',
  submitLabel = 'Submit',
  isNextDisabled,
  isLoading,
  colorScheme = 'indigo'
}: FormNavigationProps) {
  return (
    <div className="flex gap-4">
      {onBack && (
        <FormButton onClick={onBack} variant="secondary" fullWidth={false}>
          {backLabel}
        </FormButton>
      )}
      {onSubmit ? (
        <FormButton 
          onClick={onSubmit} 
          disabled={isLoading || isNextDisabled}
          colorScheme={colorScheme}
        >
          {isLoading ? 'Loading...' : submitLabel}
        </FormButton>
      ) : onNext && (
        <FormButton 
          onClick={onNext} 
          disabled={isNextDisabled}
          colorScheme={colorScheme}
        >
          {nextLabel}
        </FormButton>
      )}
    </div>
  );
}
