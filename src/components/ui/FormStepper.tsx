'use client';

import { FormStepperProps } from '@/types/components';

const colorClasses = {
  indigo: 'bg-indigo-600 text-white',
  teal: 'bg-teal-600 text-white',
};

const connectorClasses = {
  indigo: 'bg-indigo-600',
  teal: 'bg-teal-600',
};

export function FormStepper({ totalSteps, currentStep, colorScheme, stepLabels }: FormStepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              currentStep >= step ? colorClasses[colorScheme] : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step}
            {stepLabels && <span className="ml-1 text-xs">{stepLabels[step - 1]}</span>}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 md:w-24 h-0.5 mx-2 ${
                currentStep > step ? connectorClasses[colorScheme] : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
