import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthErrorBoundary } from '../AuthErrorBoundary';
import { NetworkError, AuthError } from '../../../lib/errors';
import { RecoverySystem } from '../../../lib/recovery';
import '@testing-library/jest-dom';

vi.mock('../../../lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../../../lib/recovery', () => ({
  RecoverySystem: {
    withRetry: vi.fn()
  }
}));

const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('AuthErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    const { container } = render(
      <AuthErrorBoundary>
        <div data-testid="child">Content</div>
      </AuthErrorBoundary>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(container.textContent).toBe('Content');
  });

  it('shows default error UI when an error occurs', () => {
    const error = new Error('Test error');
    
    render(
      <AuthErrorBoundary>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows custom fallback when provided', () => {
    const error = new Error('Test error');
    const fallback = <div>Custom error view</div>;

    render(
      <AuthErrorBoundary fallback={fallback}>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    expect(screen.getByText('Custom error view')).toBeInTheDocument();
  });

  it('attempts recovery for retryable errors', async () => {
    const error = new NetworkError('Network error');
    vi.mocked(RecoverySystem.withRetry).mockResolvedValueOnce(undefined);

    render(
      <AuthErrorBoundary>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    expect(screen.getByText(/attempting to recover/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(RecoverySystem.withRetry).toHaveBeenCalled();
    });
  });

  it('handles failed recovery attempts', async () => {
    const error = new NetworkError('Network error');
    vi.mocked(RecoverySystem.withRetry).mockRejectedValueOnce(new Error('Recovery failed'));

    render(
      <AuthErrorBoundary>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('skips recovery for non-retryable errors', () => {
    const error = new AuthError('Auth error');

    render(
      <AuthErrorBoundary>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(RecoverySystem.withRetry).not.toHaveBeenCalled();
  });

  it('handles retry button click', () => {
    const error = new Error('Test error');
    const reloadSpy = vi.spyOn(window.location, 'reload');
    
    render(
      <AuthErrorBoundary>
        <ThrowError error={error} />
      </AuthErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(reloadSpy).toHaveBeenCalled();
  });
});