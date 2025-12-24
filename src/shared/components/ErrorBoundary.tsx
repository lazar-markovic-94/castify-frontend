import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React component errors and prevents the entire app from crashing
 *
 * Usage:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (will be sanitized by logger)
    logger.error('ErrorBoundary caught an error:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error handler (for error tracking services like Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 */
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>

          {/* Error Description */}
          <p className="text-slate-600 mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if
            the problem persists.
          </p>

          {/* Error Details (only in development) */}
          {import.meta.env.DEV && error && (
            <details className="text-left mb-6 bg-red-50 rounded-lg p-4 border border-red-200">
              <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                Error Details (Dev Only)
              </summary>
              <pre className="text-xs text-red-900 overflow-auto max-h-48 whitespace-pre-wrap">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onReset}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simpler inline error boundary for smaller components
 */
export function InlineErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Error loading this section</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Reload page
            </button>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
