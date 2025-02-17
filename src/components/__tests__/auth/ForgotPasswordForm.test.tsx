import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { AuthContext } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Mail: () => <div data-testid="mail-icon" />
}));

describe('ForgotPasswordForm', () => {
  const mockRequestPasswordReset = vi.fn();
  const mockOnBack = vi.fn();

  const renderComponent = (authContextValue = {}) => {
    const defaultAuthContext = {
      requestPasswordReset: mockRequestPasswordReset,
      loading: false,
      error: null,
      ...authContextValue
    };

    return render(
      <AuthContext.Provider value={defaultAuthContext}>
        <ForgotPasswordForm onBack={mockOnBack} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form', () => {
    renderComponent();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderComponent();
    const backButton = screen.getByTestId('arrow-left-icon').parentElement;
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('submits the form and shows success message', async () => {
    mockRequestPasswordReset.mockResolvedValueOnce(undefined);
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.click(submitButton);

    expect(mockRequestPasswordReset).toHaveBeenCalledWith('test@example.com');
    expect(await screen.findByText(/instructions have been sent/i)).toBeInTheDocument();
  });

  it('shows loading state during submission', () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('displays error message when request fails', () => {
    renderComponent({ error: 'Failed to reset password' });
    expect(screen.getByText('Failed to reset password')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    expect(mockRequestPasswordReset).toHaveBeenCalledWith('test@example.com');
  });
});