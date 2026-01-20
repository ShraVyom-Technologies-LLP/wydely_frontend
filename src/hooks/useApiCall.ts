import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseApiCallReturn<T> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: T | null;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<{ success: boolean; data?: T; error?: any }>,
  options: UseApiCallOptions = {}
): UseApiCallReturn<T> {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      try {
        const response = await apiFunction(...args);

        if (response.success && response.data !== undefined) {
          setIsSuccess(true);
          setData(response.data);
          setIsError(false);
          setError(null);

          // Show success toast if message provided in options or in response data
          const successMessage =
            options.successMessage ||
            (response.data && typeof response.data === 'object' && 'message' in response.data
              ? (response.data as { message?: string }).message
              : null);

          if (successMessage) {
            showToast({
              type: 'success',
              title: successMessage,
            });
          }

          // Call onSuccess callback
          if (options.onSuccess) {
            options.onSuccess(response.data);
          }

          return response.data;
        } else {
          // Handle error response
          const errorMessage =
            typeof response.error === 'object' && response.error?.displayError
              ? response.error.displayError
              : typeof response.error === 'string'
              ? response.error
              : options.errorMessage || 'An error occurred';

          console.log('response', response);

          setIsError(true);
          setError(errorMessage);
          setIsSuccess(false);
          setData(null);

          // Show error toast if enabled
          if (options.showErrorToast !== false) {
            showToast({
              type: 'error',
              title: errorMessage,
            });
          }

          // Call onError callback
          if (options.onError) {
            options.onError(errorMessage);
          }

          return null;
        }
      } catch (err) {
        let errorMessage = options.errorMessage || 'Oops! Something went wrong';

        if (err instanceof Error) {
          // Handle CORS and network errors
          if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
            errorMessage = 'Oops! Something went wrong';
          } else {
            errorMessage = err.message;
          }
        }

        setIsError(true);
        setError(errorMessage);
        setIsSuccess(false);
        setData(null);

        // Show error toast if enabled
        if (options.showErrorToast !== false) {
          showToast({
            type: 'error',
            title: errorMessage,
          });
        }

        // Call onError callback
        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options, showToast]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    isSuccess,
    isError,
    data,
    error,
    execute,
    reset,
  };
}
