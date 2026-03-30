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
