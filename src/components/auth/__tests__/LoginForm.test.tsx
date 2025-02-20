/**
 * Test suite for LoginForm component
 * @module tests/LoginForm
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import { logger } from '../../../lib/logger';
import '@testing-library/jest-dom';

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
  const mockSignIn = vi.fn();
  
  const renderComponent = (authContextValue = {}) => {
    const defaultAuthContext = {
      user: null,
      session: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
      signUp: vi.fn(),
      requestPasswordReset: vi.fn(),
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
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('validates email format', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPass123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'validPass123');
    });
  });

  it('shows loading state', () => {
    renderComponent({ loading: true });
    
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderComponent({ error: 'Invalid credentials' });
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('switches to forgot password form', () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
  });

  it('switches to register form', () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/create account/i));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});