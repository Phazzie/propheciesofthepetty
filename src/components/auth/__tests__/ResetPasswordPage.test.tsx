import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResetPasswordPage } from '../ResetPasswordPage';
import { PasswordReset } from '../../../lib/passwordReset';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams]
}));

vi.mock('../../../lib/passwordReset');
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  CheckCircle2: () => <div data-testid="success-icon" />
}));

const mockNavigate = vi.fn();
let mockSearchParams: URLSearchParams;

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams({ token: 'valid-token' });
  });

  it('validates token on mount', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    render(<ResetPasswordPage />);

    expect(screen.getByText(/verifying reset link/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(PasswordReset.validateResetToken).toHaveBeenCalledWith('valid-token');
    });
  });

  it('shows error for invalid token', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(false);
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByText(/reset link has expired/i)).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText(/new password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('validates password confirmation match', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'StrongP@ss123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'DifferentP@ss123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('shows success message after password reset', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    vi.mocked(PasswordReset.resetPassword).mockResolvedValue({
      success: true,
      message: 'Password reset successful'
    });

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    const password = 'StrongP@ss123';
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: password }
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: password }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });
  });

  it('handles reset failure', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    vi.mocked(PasswordReset.resetPassword).mockResolvedValue({
      success: false,
      message: 'Reset failed'
    });

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    const password = 'StrongP@ss123';
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: password }
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: password }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/reset failed/i)).toBeInTheDocument();
    });
  });

  it('redirects to login after successful reset', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    vi.mocked(PasswordReset.resetPassword).mockResolvedValue({
      success: true,
      message: 'Password reset successful'
    });

    vi.useFakeTimers();
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    const password = 'StrongP@ss123';
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: password }
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: password }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(3000);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    vi.useRealTimers();
  });

  it('toggles password visibility', async () => {
    vi.mocked(PasswordReset.validateResetToken).mockResolvedValue(true);
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText(/new password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});