import { useState, useCallback } from 'react';
import { ApiResponse } from '@/types';

interface UseApiOptions {
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useApi<T>(options: UseApiOptions = {}) {
  const {
    retry = true,
    retryAttempts = 3,
    retryDelay = 1000,
    onError,
    onSuccess,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null, success: false }));

      let attempts = 0;
      const maxAttempts = retry ? retryAttempts : 1;

      while (attempts < maxAttempts) {
        try {
          const response = await apiCall();

          if (response.success && response.data) {
            setState({
              data: response.data,
              loading: false,
              error: null,
              success: true,
            });
            onSuccess?.();
            return true;
          } else {
            const errorMsg = response.error || 'Request failed';
            
            // Don't retry on client errors (4xx)
            if (!retry || attempts >= maxAttempts - 1) {
              setState({
                data: null,
                loading: false,
                error: errorMsg,
                success: false,
              });
              onError?.(errorMsg);
              return false;
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Network error';
          
          if (!retry || attempts >= maxAttempts - 1) {
            setState({
              data: null,
              loading: false,
              error: errorMsg,
              success: false,
            });
            onError?.(errorMsg);
            return false;
          }
          
          attempts++;
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
        }
      }

      return false;
    },
    [retry, retryAttempts, retryDelay, onError, onSuccess]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
}

export function useAsyncAction<T>(options: UseApiOptions = {}) {
  const { execute, reset, clearError, ...state } = useApi<T>(options);

  const performAction = useCallback(
    async (action: () => Promise<ApiResponse<T>>) => {
      return execute(action);
    },
    [execute]
  );

  return {
    ...state,
    performAction,
    reset,
    clearError,
  };
}

export function useFormSubmission<T>(
  submitFn: (data: Record<string, unknown>) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { execute, reset, clearError, ...state } = useApi<T>(options);

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      return execute(() => submitFn(data));
    },
    [execute, submitFn]
  );

  return {
    ...state,
    submit,
    reset,
    clearError,
  };
}
