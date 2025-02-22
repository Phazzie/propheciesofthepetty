import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../auth/LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock ForgotPasswordForm
vi.mock('../../auth/ForgotPasswordForm', () => ({
  ForgotPasswordForm: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBack}>Back</button>
    </div>
  )
}));

// Mock RegisterForm
vi.mock('../../auth/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">Register Form</div>
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />
}));

// Mock logger
vi.mock('../../../lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  
  const renderComponent = (authContextValue = {}) => {
    const defaultAuthContext = {
      login: mockLogin,
      loading: false,
      error: null,
      ...authContextValue
    };

    return render(
      <AuthContext.Provider value={defaultAuthContext}>
        <LoginForm />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderComponent();
    expect(screen.getByText(/welcome to passive-aggressive tarot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('switches to register form view', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('validates password length', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPass123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'validPass123', false);
    });
  });

  it('shows loading state', () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderComponent({ error: 'Invalid credentials' });
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('switches to forgot password form', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
  });
});