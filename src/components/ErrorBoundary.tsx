import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { logger } from '../lib/logger';
import { RecoverySystem } from '../lib/recovery';
import { handleError, AppError } from '../lib/errors';

interface Props {
  children: ReactNode;
  fallbackUI?: ReactNode;
  onReset?: () => void;
  onBack?: () => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error?: AppError;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const handledError = handleError(error);
    return { 
      hasError: true, 
      error: handledError,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const handledError = handleError(error);
    
    logger.error(
      'Error caught by boundary',
      handledError,
      {
        componentStack: errorInfo.componentStack,
        severity: handledError.severity,
        code: handledError.code,
        details: handledError.details
      },
      'ErrorBoundary',
      'componentDidCatch'
    );

    this.setState({ error: handledError, errorInfo });
    
    // Attempt automatic recovery for recoverable errors
    if (handledError.severity === 'low') {
      this.attemptRecovery();
    }
  }

  private attemptRecovery = async () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount, error } = this.state;

    if (retryCount < maxRetries && error) {
      try {
        await RecoverySystem.recover(error);
        this.setState({ 
          hasError: false, 
          error: undefined, 
          retryCount: retryCount + 1 
        });
      } catch (recoveryError) {
        logger.error('Recovery attempt failed', recoveryError);
      }
    }
  };

  private handleRefresh = () => {
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  private handleBack = () => {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
      window.history.back();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackUI) {
        return this.props.fallbackUI;
      }

      const { error } = this.state;
      const severity = error?.severity || 'medium';
      
      const severityConfig = {
        low: {
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        },
        medium: {
          iconColor: 'text-orange-500',
          borderColor: 'border-orange-200',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        },
        high: {
          iconColor: 'text-red-500',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50 dark:bg-red-900/10',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        }
      };

      const { iconColor, borderColor, bgColor, buttonColor } = severityConfig[severity];

      return (
        <div
          className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-gray-900 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className={`max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border ${borderColor}`}>
            <AlertTriangle 
              className={`w-16 h-16 mx-auto mb-6 ${iconColor}`}
              aria-hidden="true" 
            />
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error?.name || 'Something went wrong'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error?.message || 'An unexpected error occurred. Our cards are having a moment.'}
            </p>

            {error && import.meta.env.DEV && (
              <div className={`mb-6 p-4 ${bgColor} rounded-lg text-left`}>
                <p className={`text-sm font-mono ${iconColor} break-words whitespace-pre-wrap`}>
                  {error.stack}
                </p>
                {this.state.errorInfo && (
                  <p className="mt-2 text-sm font-mono text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap">
                    Component Stack:{'\n'}{this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRefresh}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${buttonColor} text-white rounded-lg transition-colors`}
                aria-label="Try again"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={this.handleBack}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
              
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}