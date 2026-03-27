import { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`} />
      {message && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${textSizes[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showIcon?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  showIcon = true,
}: ErrorStateProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      {showIcon && (
        <div className="w-12 h-12 mx-auto mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
        {title}
      </h3>
      <p className="text-red-600 dark:text-red-400 text-sm mb-4">
        {message}
      </p>
      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm mx-auto">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface AsyncContentProps<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  loadingMessage?: string;
  errorTitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
}

export function AsyncContent<T>({
  loading,
  error,
  data,
  loadingMessage = 'Loading...',
  errorTitle = 'Failed to load',
  emptyTitle = 'No data found',
  emptyMessage = 'There is no data to display.',
  onRetry,
  children,
}: AsyncContentProps<T>) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return <>{children(data)}</>;
}
