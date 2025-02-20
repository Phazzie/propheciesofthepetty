/**
 * Test suite for LoginForm component
 * @module tests/LoginForm
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock dependencies
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />
}));

const renderLoginForm = (authContextValue = {}) => {
  const defaultContext = {
    user: null,
    login: mockLogin,
    loading: false,
    error: null,
    ...authContextValue
  };

  return render(
    <AuthContext.Provider value={defaultContext}>
      <LoginForm />
    </AuthContext.Provider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderLoginForm();
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates empty form fields', async () => {
    renderLoginForm();
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderLoginForm();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    renderLoginForm();
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles remember me checkbox', async () => {
    renderLoginForm();
    
    const email = 'test@example.com';
    const password = 'validPassword123';
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: email }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: password }
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(email, password, true);
    });
  });

  it('shows loading state during submission', () => {
    renderLoginForm({ loading: true });
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('displays authentication errors', async () => {
    const errorMessage = 'Invalid credentials';
    renderLoginForm({ error: errorMessage });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('handles password visibility toggle', () => {
    renderLoginForm();
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('switches to registration form', () => {
    renderLoginForm();
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('switches to forgot password form', () => {
    renderLoginForm();
    
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
  });

  it('clears validation errors when input changes', async () => {
    renderLoginForm();
    
    // Trigger validation errors
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    
    // Error should clear on input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderLoginForm();
    
    const email = 'test@example.com';
    const password = 'validPassword123';
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: email }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: password }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(email, password, false);
    });
  });
});