import { useState, useCallback } from 'react';
import { ApiError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// Generic hook for API calls with loading and error states
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T; success: boolean }>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'An unexpected error occurred';
        
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    
    try {
      await operation();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFunction: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (optimisticUpdate: (data: T) => T) => {
      const previousData = data;
      
      // Apply optimistic update immediately
      setData(optimisticUpdate(data));
      setLoading(true);
      setError(null);

      try {
        // Perform actual update
        const updatedData = await updateFunction(data);
        setData(updatedData);
      } catch (error) {
        // Revert on error
        setData(previousData);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Update failed';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [data, updateFunction]
  );

  return {
    data,
    loading,
    error,
    update,
  };
}

// Hook for debounced API calls
export function useDebouncedApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T; success: boolean }>,
  delay: number = 300
): UseApiReturn<T> {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const apiHook = useApi(apiFunction);

  const debouncedExecute = useCallback(
    (...args: any[]): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        const timer = setTimeout(async () => {
          try {
            const result = await apiHook.execute(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);

        setDebounceTimer(timer);
      });
    },
    [apiHook.execute, debounceTimer, delay]
  );

  return {
    ...apiHook,
    execute: debouncedExecute,
  };
}