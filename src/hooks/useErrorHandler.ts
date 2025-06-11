
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  logToConsole?: boolean;
  reportToService?: boolean;
}

export function useErrorHandler() {
  const handleError = useCallback((
    error: Error | string, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastMessage,
      logToConsole = true,
      reportToService = false
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorObject = typeof error === 'string' ? new Error(error) : error;

    // Log to console
    if (logToConsole) {
      console.error('Error handled:', errorObject);
    }

    // Show toast notification
    if (showToast) {
      toast.error(toastMessage || errorMessage || 'An unexpected error occurred');
    }

    // Report to error service (in production)
    if (reportToService && process.env.NODE_ENV === 'production') {
      // Here you would integrate with an error reporting service like Sentry
      console.error('Error to report:', errorObject);
    }

    return errorObject;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}
