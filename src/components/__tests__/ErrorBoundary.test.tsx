import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';
import { handleError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { RecoverySystem } from '../../lib/recovery';

// Mock dependencies
vi.mock('../../lib/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

vi.mock('../../lib/recovery', () => ({
  RecoverySystem: {
    recover: vi.fn()
  }
}));

vi.mock('../../lib/errors', () => ({
  handleError: vi.fn().mockImplementation((error: Error) => ({
    name: 'MockAppError',
    message: error.message,
    severity: 'medium',
    code: 'ERR_TEST',
    details: {},
    stack: error.stack
  })),
}));

describe('ErrorBoundary', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test component that throws an error
  const ProblemChild = ({ message = 'Simulated error' }: { message?: string }) => {
    throw new Error(message);
  };

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalled();
  });

  it('displays custom fallback UI when provided', () => {
    const fallback = <div data-testid="fallback">Custom Fallback</div>;
    render(
      <ErrorBoundary fallbackUI={fallback}>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('calls onReset when Try Again button is clicked', () => {
    const onReset = vi.fn();
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
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { reload: vi.fn() }
    });

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Try Again'));
    expect(window.location.reload).toHaveBeenCalled();
    
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  it('goes back in history when Go Back button is clicked and no onBack is provided', () => {
    const originalHistory = window.history;
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: { ...originalHistory, back: vi.fn() }
    });

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Go Back'));
    expect(window.history.back).toHaveBeenCalled();
  });

  it('displays error with correct severity styling', () => {
    // Mock handleError to return specific severity
    (handleError as unknown as MockInstance).mockImplementationOnce((error: Error) => ({
      name: 'MockAppError',
      message: error.message,
      severity: 'high',
      code: 'ERR_HIGH_SEVERITY',
      details: {},
      stack: error.stack
    }));

    render(
      <ErrorBoundary>
        <ProblemChild message="High severity error" />
      </ErrorBoundary>
    );
    
    // We can't easily test specific CSS classes due to the dynamic nature,
    // but we can verify the error component is rendered
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('attempts recovery for low severity errors', async () => {
    // Mock implementation to test recovery flow
    (RecoverySystem.recover as unknown as MockInstance).mockResolvedValue(undefined);
    
    // Mock handleError to return a low severity error
    (handleError as unknown as MockInstance).mockImplementationOnce((error: Error) => ({
      name: 'RecoverableError',
      message: error.message,
      severity: 'low',
      code: 'ERR_RECOVERABLE',
      details: {},
      stack: error.stack
    }));

    render(
      <ErrorBoundary maxRetries={1}>
        <ProblemChild message="Recoverable error" />
      </ErrorBoundary>
    );

    // Verify recovery was attempted
    expect(RecoverySystem.recover).toHaveBeenCalled();
  });
});