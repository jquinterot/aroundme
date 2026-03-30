import { FormButton } from './FormButton';

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
