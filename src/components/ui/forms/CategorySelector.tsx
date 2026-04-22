import { CATEGORY_ICONS } from '@/lib/constants';

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
  colorScheme?: 'indigo' | 'teal' | 'amber';
  testId?: string;
  helperText?: string;
}

export function CategorySelector({
  label,
  value,
  onChange,
  options,
  colorScheme = 'indigo',
  testId,
  helperText,
}: CategorySelectorProps) {
  const selectedClass = {
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400 shadow-sm',
    teal: 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400 shadow-sm',
    amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-400 shadow-sm',
  }[colorScheme];
  const unselectedClass = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800';

  return (
    <div data-testid={testId}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{helperText}</p>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {options.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.value] || CATEGORY_ICONS.other;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange(cat.value)}
              className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all ${
                value === cat.value ? selectedClass : unselectedClass
              } dark:bg-gray-800 dark:text-gray-200 min-w-0`}
              data-testid={`${testId}-${cat.value}`}
            >
              <span className="block flex justify-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <p className="text-xs mt-1 font-medium truncate">{cat.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
