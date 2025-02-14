import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterForm from '../RegisterForm';

test('hello world!', () => {
	render(<RegisterForm />);
	const linkElement = screen.getByText(/register/i);
	expect(linkElement).toBeInTheDocument();
});