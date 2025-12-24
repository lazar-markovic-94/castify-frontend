import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { logger } from '../../shared/utils/logger';

/**
 * Determine if an error should be retried
 * Don't retry on 4xx errors (client errors) except 408, 429
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  // Max 3 retries
  if (failureCount >= 3) {
    return false;
  }

  // Don't retry on client errors (4xx) except specific cases
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status) {
      // Retry on these specific 4xx codes
      if (status === 408 || status === 429) {
        return true;
      }

      // Don't retry on other 4xx errors
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    // Retry on network errors
    if (!error.response) {
      return true;
    }
  }

  // Retry on 5xx errors
  return true;
}

/**
 * Calculate retry delay with exponential backoff
 * 1st retry: 1s, 2nd retry: 2s, 3rd retry: 4s
 */
function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30s
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: shouldRetry,
      retryDelay,
      refetchOnWindowFocus: false, // Disable refetch on window focus in production
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: false, // Don't retry mutations by default (can be overridden per mutation)
      onError: (error) => {
        logger.error('Mutation error:', error);
      },
    },
  },
  logger: {
    log: (...args) => logger.log(...args),
    warn: (...args) => logger.warn(...args),
    error: (...args) => logger.error(...args),
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
