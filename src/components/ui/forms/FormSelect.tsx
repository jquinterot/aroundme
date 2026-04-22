'use client';

import { Select } from '@mantine/core';

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  testId?: string;
}

export function FormSelect({ label, value, onChange, options, required, testId }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <Select
        value={value}
        onChange={(val) => val && onChange(val)}
        data={options}
        required={required}
        data-testid={testId}
        classNames={{
          input: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 !border-gray-300 dark:!border-gray-600',
        }}
      />
    </div>
  );
}
