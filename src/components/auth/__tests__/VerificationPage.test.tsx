import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { VerificationPage } from '../VerificationPage';
import { EmailVerification } from '../../../lib/emailVerification';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams({ token: 'test-token' })]
}));

vi.mock('../../../lib/emailVerification');
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  CheckCircle2: () => <div data-testid="success-icon" />,
  Loader: () => <div data-testid="loader-icon" />
}));

describe('VerificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<VerificationPage />);
    expect(screen.getByText(/verifying email/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('shows success state on successful verification', async () => {
    vi.mocked(EmailVerification.verifyEmail).mockResolvedValueOnce({
      success: true,
      message: 'Verified successfully'
    });

    render(<VerificationPage />);

    await waitFor(() => {
      expect(screen.getByText(/email verified/i)).toBeInTheDocument();
      expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    });
  });

  it('shows error state on verification failure', async () => {
    const errorMessage = 'Verification failed';
    vi.mocked(EmailVerification.verifyEmail).mockResolvedValueOnce({
      success: false,
      message: errorMessage
    });

    render(<VerificationPage />);

    await waitFor(() => {
      expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });
  });

  it('shows error when no token is provided', async () => {
    vi.mock('react-router-dom', () => ({
      useNavigate: () => vi.fn(),
      useSearchParams: () => [new URLSearchParams()]
    }));

    render(<VerificationPage />);

    await waitFor(() => {
      expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
      expect(screen.getByText(/no verification token provided/i)).toBeInTheDocument();
    });
  });

  it('redirects to login after successful verification', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      useSearchParams: () => [new URLSearchParams({ token: 'test-token' })]
    }));

    vi.mocked(EmailVerification.verifyEmail).mockResolvedValueOnce({
      success: true,
      message: 'Verified successfully'
    });

    vi.useFakeTimers();
    render(<VerificationPage />);

    await waitFor(() => {
      expect(screen.getByText(/email verified/i)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(3000);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    vi.useRealTimers();
  });
});