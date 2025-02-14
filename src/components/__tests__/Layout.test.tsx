import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

test('hello world!', () => {
	render(<Layout />);
	const linkElement = screen.getByText(/hello world/i);
	expect(linkElement).toBeInTheDocument();
});