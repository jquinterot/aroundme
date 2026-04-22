interface ToggleOptionProps {
  options: {
    value: boolean;
    label: string;
    icon: string;
    description: string;
  }[];
  selected: boolean;
  onChange: (value: boolean) => void;
  colorScheme?: 'indigo' | 'teal';
}

export function ToggleOption({ options, selected, onChange, colorScheme = 'indigo' }: ToggleOptionProps) {
  const selectedClass = {
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400 shadow-sm',
    teal: 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400 shadow-sm',
  }[colorScheme];
  const unselectedClass = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';

  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
            selected === option.value ? selectedClass : unselectedClass
          }`}
        >
          <span className="text-2xl sm:text-3xl">{option.icon}</span>
          <p className="font-medium mt-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">{option.description}</p>
        </button>
      ))}
    </div>
  );
}
