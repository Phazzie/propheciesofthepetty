import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContextProvider } from '../AuthContext';

test('hello world!', () => {
    render(
        <AuthContextProvider>
            <div>Hello World</div>
        </AuthContextProvider>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});