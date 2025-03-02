import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { PasswordReset } from '../../../lib/passwordReset';
import '@testing-library/jest-dom';
import { renderWithTestContext, mockAuthContext } from '../../../test/TestContextProvider';

vi.mock('../../../lib/passwordReset');
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Mail: () => <div data-testid="mail-icon" />
}));

describe('ForgotPasswordForm', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (authContextValue = {}) => {
    return renderWithTestContext(
      <ForgotPasswordForm onBack={mockOnBack} />, 
      { authContext: { ...mockAuthContext, ...authContextValue } }
    );
  };

  it('validates empty email', async () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(PasswordReset.initiateReset).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(PasswordReset.initiateReset).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    vi.mocked(PasswordReset.initiateReset).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });

  it('displays success message after successful submission', async () => {
    vi.mocked(PasswordReset.initiateReset).mockResolvedValueOnce();
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    expect(await screen.findByText(/instructions have been sent/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return to login/i })).toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    const errorMessage = 'Failed to send reset instructions';
    vi.mocked(PasswordReset.initiateReset).mockRejectedValueOnce(new Error(errorMessage));
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderForm();
    const backButton = screen.getByTestId('arrow-left-icon').parentElement;
    if (backButton) {
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalled();
    }
  });

  it('handles return to login after success', async () => {
    vi.mocked(PasswordReset.initiateReset).mockResolvedValueOnce();
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    
    await screen.findByText(/instructions have been sent/i);
    
    fireEvent.click(screen.getByRole('button', { name: /return to login/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('clears validation errors when email input changes', async () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: /send reset instructions/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});