import { screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../../auth/RegisterForm';
import { EmailVerification } from '../../../lib/emailVerification';
import '@testing-library/jest-dom';
import { renderWithTestContext, mockAuthContext } from '../../../test/TestContextProvider';

// Mock EmailVerification
vi.mock('../../../lib/emailVerification');

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
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

describe('RegisterForm', () => {
  const mockRegister = vi.fn();
  const mockOnBack = vi.fn();

  const renderComponent = (authContextValue = {}) => {
    return renderWithTestContext(
      <RegisterForm onBack={mockOnBack} />, 
      { authContext: { ...mockAuthContext, ...authContextValue } }
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    renderComponent();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/terms and conditions/i)).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /create account$/i });

    // Test minimum length
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();

    // Test uppercase requirement
    fireEvent.change(passwordInput, { target: { value: 'lowercase123' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();

    // Test lowercase requirement
    fireEvent.change(passwordInput, { target: { value: 'UPPERCASE123' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();

    // Test number requirement
    fireEvent.change(passwordInput, { target: { value: 'PasswordNoNumber' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
  });

  it('validates password confirmation match', () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account$/i });

    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('requires terms acceptance', () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account$/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/must accept the terms/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    vi.mocked(EmailVerification.sendVerificationEmail).mockResolvedValueOnce();
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const termsCheckbox = screen.getByLabelText(/terms and conditions/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });
    fireEvent.click(termsCheckbox);
    
    const submitButton = screen.getByRole('button', { name: /create account$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'ValidPass123');
      expect(EmailVerification.sendVerificationEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows loading state', () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderComponent({ error: 'Registration failed' });
    expect(screen.getByText('Registration failed')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderComponent();
    const backButton = screen.getByTestId('arrow-left-icon').parentElement;
    if (backButton) {
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalled();
    }
  });
});