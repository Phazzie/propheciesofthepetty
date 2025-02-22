const fs = require('fs');

const testDir = 'src/components/__tests__';
const testFiles = fs.readdirSync(testDir).flatMap((dir: string) => fs.readdirSync(`${testDir}/${dir}`));
const totalTests = testFiles.length;

const results = {
  totalTests: totalTests,
  passedTests: 12, // Example value, replace with actual passed tests count
  failedTests: totalTests - 12, // Example value, replace with actual failed tests count
  percentagePass: (12 / totalTests) * 100 // Example calculation
};

console.log(`Total Tests: ${results.totalTests}`);
console.log(`Passed Tests: ${results.passedTests}`);
console.log(`Failed Tests: ${results.failedTests}`);
console.log(`Percentage Pass: ${results.percentagePass.toFixed(2)}%`);

// Additional tests needed based on project requirements
const additionalTestsNeeded = 5; // Example value, replace with actual needed tests count
console.log(`Additional Tests Needed: ${additionalTestsNeeded}`);

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../../components/auth/LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

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
      register: jest.fn() as any,
      logout: jest.fn() as any,
      requestPasswordReset: jest.fn() as any,
      refreshSession: jest.fn() as any,
      user: null,
      session: null,
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
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('switches to register form view', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/don't have an account/i));
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('validates password length', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPass123' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'validPass123');
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
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'ValidPass123');
  });
});