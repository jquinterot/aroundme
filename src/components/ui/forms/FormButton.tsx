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
