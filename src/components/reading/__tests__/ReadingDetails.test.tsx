import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadingDetails from '../ReadingDetails';

test('renders ReadingDetails with Hello World', () => {
    render(<ReadingDetails />);
    const linkElement = screen.getByText(/hello world/i);
    expect(linkElement).toBeInTheDocument();
});