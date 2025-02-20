import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logger } from '../../lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  onBack?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      'Error caught by boundary',
      error instanceof Error ? error : new Error('Unknown error'),
      { componentStack: errorInfo.componentStack },
      'ErrorBoundary',
      'componentDidCatch'
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-purple-50"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
            <button
              onClick={() => {
                if (this.props.onReset) {
                  this.props.onReset();
                } else {
                  window.location.reload();
                }
              }}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              aria-label="Refresh the page"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                if (this.props.onBack) {
                  this.props.onBack();
                } else {
                  window.history.back();
                }
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors ml-4"
              aria-label="Go back"
            >
              Go Back
            </button>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Test to ensure ErrorBoundary catches errors and displays fallback UI

describe('ErrorBoundary', () => {
  it('catches errors and displays fallback UI', () => {
    const ProblemChild = () => {
      throw new Error('Simulated error');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onReset when Try Again button is clicked', () => {
    const onReset = vi.fn();
    const ProblemChild = () => {
      throw new Error('Simulated error');
    };

    render(
      <ErrorBoundary onReset={onReset}>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(onReset).toHaveBeenCalled();
  });

  it('calls onBack when Go Back button is clicked', () => {
    const onBack = vi.fn();
    const ProblemChild = () => {
      throw new Error('Simulated error');
    };

    render(
      <ErrorBoundary onBack={onBack}>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Go Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('reloads the page when Try Again button is clicked and no onReset is provided', () => {
    const originalLocation = window.location;
    window.location = {} as Location;
    window.location = { ...originalLocation, reload: vi.fn() };

    const ProblemChild = () => {
      throw new Error('Simulated error');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });

  it('goes back in history when Go Back button is clicked and no onBack is provided', () => {
    const originalHistory = window.history;
    window.history.back = vi.fn();

    const ProblemChild = () => {
      throw new Error('Simulated error');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Go Back'));
    expect(window.history.back).toHaveBeenCalled();

    window.history = originalHistory;
  });
});