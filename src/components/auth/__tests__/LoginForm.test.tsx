/**
 * Test suite for LoginForm component
 * @module tests/LoginForm
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { useAuth, AuthProvider } from '../../../context/AuthContext';
import { describe, it, expect, vi } from 'vitest';

// Mock the auth context
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('LoginForm', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });

  it('shows loading state during login', async () => {
    vi.mocked(useAuth).mockImplementation(() => ({
      login: vi.fn(),
      loading: true,
      error: null
    }));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(useAuth).mockImplementation(() => ({
      login: vi.fn(),
      loading: false,
      error: errorMessage
    }));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders login form and submits credentials', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Expect an async API call, so you might wait or check for combined UI changes.
    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  it('submits the form correctly', async () => {
    const mockLogin = vi.fn();
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      loading: false,
      error: null
    }));

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});