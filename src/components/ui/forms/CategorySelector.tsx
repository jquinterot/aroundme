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
  testId?: string;
}

export function CategorySelector({ 
  label, 
  value, 
  onChange, 
  options,
  colorScheme = 'indigo',
  testId
}: CategorySelectorProps) {
  const selectedClass = colorScheme === 'indigo' 
    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400' 
    : 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400';
  const unselectedClass = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';

  return (
    <div data-testid={testId}>
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
            data-testid={`${testId}-${cat.value}`}
          >
            <span className="text-lg sm:text-xl block">{cat.icon}</span>
            <p className="text-[10px] sm:text-xs mt-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">{cat.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
