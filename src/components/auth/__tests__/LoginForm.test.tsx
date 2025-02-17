/**
 * Test suite for LoginForm component
 * @module tests/LoginForm
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';

// Mock the auth context
const defaultAuthContext = {
  user: null,
  session: null,
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  requestPasswordReset: vi.fn(),
  loading: false,
  error: null
};

const renderComponent = () => {
  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <LoginForm />
    </AuthContext.Provider>
  );
};

// Mock child components
vi.mock('../RegisterForm', () => ({
  RegisterForm: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="register-form">
      <button onClick={onBack}>Back</button>
    </div>
  )
}));

vi.mock('../ForgotPasswordForm', () => ({
  ForgotPasswordForm: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBack}>Back</button>
    </div>
  )
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
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
  });

  it('switches to register form', () => {
    const mockSetAuthMode = vi.fn();
    render(
      <AuthContext.Provider value={defaultAuthContext}>
        <LoginForm onSwitchMode={mockSetAuthMode} />
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(mockSetAuthMode).toHaveBeenCalledWith('register');
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

    expect(await screen.findByText(/password must be at least/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPass123' } });
    fireEvent.click(submitButton);

    expect(defaultAuthContext.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'validPass123'
    });
  });
});