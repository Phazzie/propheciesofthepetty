import React, { Component, ErrorInfo } from 'react';
import { logger } from '../lib/logger';
import { isAppError, handleError, BaseError } from '../lib/errors';
import { RecoverySystem } from '../lib/recovery';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      error,
      errorInfo: null,
      isRecovering: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    logger.error('Auth component error', error, { componentStack: errorInfo.componentStack });

    if (isAppError(error)) {
      this.handleAppError(error);
    }
  }

  private async handleAppError(error: BaseError) {
    if (error.metadata.retry) {
      this.setState({ isRecovering: true });
      
      try {
        await RecoverySystem.withRetry(
          async () => {
            // Attempt recovery based on error type
            if (error.metadata.code === 'NETWORK_ERROR') {
              await this.retryNetworkOperation();
            } else if (error.metadata.code === 'AUTH_ERROR') {
              await this.refreshAuthSession();
            }
          },
          {
            retryConfig: {
              maxAttempts: 3,
              initialDelay: error.metadata.retryDelay || 1000
            },
            onError: (retryError) => {
              logger.error('Recovery failed', retryError);
            }
          }
        );

        // If recovery successful, clear the error state
        this.setState({ error: null, errorInfo: null, isRecovering: false });
      } catch (recoveryError) {
        this.setState({ isRecovering: false });
      }
    }
  }

  private async retryNetworkOperation() {
    // Implementation for retrying network operations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async refreshAuthSession() {
    // Implementation for refreshing auth session
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  render() {
    const { error, isRecovering } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      if (isRecovering) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-purple-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Attempting to recover...</p>
            </div>
          </div>
        );
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-purple-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}