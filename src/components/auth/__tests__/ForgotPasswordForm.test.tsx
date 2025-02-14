import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPasswordForm from '../ForgotPasswordForm';

test('renders Forgot Password form', () => {
    render(<ForgotPasswordForm />);
    const linkElement = screen.getByText(/Forgot Password/i);
    expect(linkElement).toBeInTheDocument();
});

test('submits the form', () => {
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/Submit/i));
    const successMessage = screen.getByText(/Check your email for instructions/i);
    expect(successMessage).toBeInTheDocument();
});