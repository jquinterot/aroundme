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
  backTestId?: string;
  nextTestId?: string;
  submitTestId?: string;
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
  colorScheme = 'indigo',
  backTestId,
  nextTestId,
  submitTestId
}: FormNavigationProps) {
  return (
    <div className="flex gap-4">
      {onBack && (
        <FormButton onClick={onBack} variant="secondary" fullWidth={false} testId={backTestId}>
          {backLabel}
        </FormButton>
      )}
      {onSubmit ? (
        <FormButton 
          onClick={onSubmit} 
          disabled={isLoading || isNextDisabled}
          colorScheme={colorScheme}
          testId={submitTestId}
        >
          {isLoading ? 'Loading...' : submitLabel}
        </FormButton>
      ) : onNext && (
        <FormButton 
          onClick={onNext} 
          disabled={isNextDisabled}
          colorScheme={colorScheme}
          testId={nextTestId}
        >
          {nextLabel}
        </FormButton>
      )}
    </div>
  );
}
