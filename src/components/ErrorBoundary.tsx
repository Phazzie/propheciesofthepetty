import { AlertTriangle, RefreshCw } from 'lucide-react';
import React, { Component, ErrorInfo, useState } from 'react';
import { logger } from '../lib/logger';

interface ErrorBoundaryProps {
  fallbackUI?: React.ReactElement | ((error: Error, reset: () => void) => React.ReactElement);
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropChange?: any[]; // Reset when these props change
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * This enhanced version incorporates detailed error logging and supports multiple fallback UI variants
 * based on the type of error encountered.
 * 
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * // With custom fallback
 * <ErrorBoundary 
 *   fallbackUI={(error, reset) => <CustomError message={error.message} onReset={reset} />}
 *   onError={(error) => notifyUser(error)}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Ensure that error is non-null by using the provided error or a fallback
    return { hasError: true, error: error || new Error('An unknown error occurred') };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error and error information.
    logger.error('ErrorBoundary caught an error:', error);
    logger.error('ErrorBoundary caught error information:', error, errorInfo);
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset the error boundary when specified props change
    if (this.state.hasError && this.props.resetOnPropChange) {
      const hasChanged = this.props.resetOnPropChange.some(
        (prop, index) => prop !== prevProps.resetOnPropChange?.[index]
      );

      if (hasChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  /**
   * Categorizes errors to provide more specific feedback
   */
  categorizeError(): 'network' | 'auth' | 'timeout' | 'data' | 'unknown' {
    const errorMessage = this.state.error?.message || '';
    
    if (/network|fetch|request|connection/i.test(errorMessage)) {
      return 'network';
    }
    if (/unauthorized|forbidden|permission|auth/i.test(errorMessage)) {
      return 'auth';
    }
    if (/timeout|timed out/i.test(errorMessage)) {
      return 'timeout';
    }
    if (/data|parse|json|syntax/i.test(errorMessage)) {
      return 'data';
    }
    return 'unknown';
  }

  /**
   * Renders a fallback UI based on the error type.
   */
  renderFallback(): React.ReactElement {
    const errorType = this.categorizeError();
    const ErrorIcon = AlertTriangle;
    const ResetIcon = RefreshCw;

    // Now using the previously unused imported icons
    switch (errorType) {
      case 'network':
        return (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            <div className="flex items-center mb-2">
              <ErrorIcon className="w-5 h-5 mr-2" />
              <h2 className="font-semibold text-lg">Network Error</h2>
            </div>
            <p className="mb-4">Please check your connection and try again.</p>
            <button 
              onClick={this.resetErrorBoundary}
              className="flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-red-700 transition-colors mr-2"
            >
              <ResetIcon className="w-4 h-4 mr-1" /> Try Again
            </button>
          </div>
        );
      case 'auth':
        return (
          <div className="text-orange-500 p-4 border border-orange-300 rounded-md bg-orange-50">
            <div className="flex items-center mb-2">
              <ErrorIcon className="w-5 h-5 mr-2" />
              <h2 className="font-semibold text-lg">Authentication Error</h2>
            </div>
            <p className="mb-4">You might need to log in again or lack permission for this action.</p>
            <button 
              onClick={this.resetErrorBoundary}
              className="flex items-center px-3 py-1 bg-orange-100 hover:bg-orange-200 rounded-md text-orange-700 transition-colors"
            >
              <ResetIcon className="w-4 h-4 mr-1" /> Try Again
            </button>
          </div>
        );
      default:
        return (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            <div className="flex items-center mb-2">
              <ErrorIcon className="w-5 h-5 mr-2" />
              <h2 className="font-semibold text-lg">Something went wrong</h2>
            </div>
            <p className="mb-4">Please try again. If the problem persists, contact support.</p>
            <div className="flex">
              <button 
                onClick={this.resetErrorBoundary}
                className="flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-red-700 transition-colors mr-2"
              >
                <ResetIcon className="w-4 h-4 mr-1" /> Try Again
              </button>
              <button 
                onClick={this.handleRefresh}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-sm bg-gray-50 p-2 rounded border">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        );
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback function that receives error and reset function
      if (typeof this.props.fallbackUI === 'function') {
        return this.props.fallbackUI(this.state.error!, this.resetErrorBoundary);
      }
      
      // If a custom fallback UI element is provided, use it, else use the dynamically generated one.
      return this.props.fallbackUI || this.renderFallback();
    }

    return this.props.children;
  }
}

/**
 * A hook-based wrapper around ErrorBoundary for functional components
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const showBoundary = (error: Error) => {
    setError(error);
  };

  // Reset the error state
  const resetBoundary = () => {
    setError(null);
  };

  return { error, showBoundary, resetBoundary };
}