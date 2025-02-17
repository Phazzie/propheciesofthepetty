import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContextProvider } from '../AuthContext';

test('renders AuthContextProvider with Hello World', () => {
    render(
        <AuthContextProvider>
            <div>Hello World</div>
        </AuthContextProvider>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});