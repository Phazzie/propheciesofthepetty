import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../RegisterForm';
import { AuthContext } from '../../../context/AuthContext';
import { EmailVerification } from '../../../lib/emailVerification';
import '@testing-library/jest-dom';

vi.mock('../../../lib/emailVerification');
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  CheckCircle2: () => <div data-testid="check-circle-icon" />
}));

const mockRegister = vi.fn();
const mockOnBack = vi.fn();

const renderComponent = (authContextValue = {}) => {
  return render(
    <AuthContext.Provider value={{
      register: mockRegister,
      loading: false,
      error: null,
      ...authContextValue
    }}>
      <RegisterForm onBack={mockOnBack} />
    </AuthContext.Provider>
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates all empty fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/must be at least 8 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/must accept the terms/i)).toBeInTheDocument();
  });

  it('shows password strength indicator', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);

    // Weak password
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument();

    // Medium password
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    expect(screen.getByText(/must include a special character/i)).toBeInTheDocument();

    // Strong password
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    expect(screen.queryByText(/must include/i)).not.toBeInTheDocument();
  });

  it('validates password confirmation', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPass123!' } });
    fireEvent.blur(confirmInput);

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    renderComponent();
    
    const email = 'test@example.com';
    const password = 'StrongP@ss123';

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: password } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: password } });
    fireEvent.click(screen.getByLabelText(/terms and conditions/i));
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(email, password);
      expect(EmailVerification.sendVerificationEmail).toHaveBeenCalledWith(email);
    });
  });

  it('shows loading state during submission', () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });

  it('displays authentication errors', () => {
    const errorMessage = 'Email already in use';
    renderComponent({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles back button click', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('arrow-left-icon').parentElement);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables form submission during loading', () => {
    renderComponent({ loading: true });
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
    expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
    expect(screen.getByLabelText(/terms and conditions/i)).toBeDisabled();
  });

  it('validates email format', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });
});