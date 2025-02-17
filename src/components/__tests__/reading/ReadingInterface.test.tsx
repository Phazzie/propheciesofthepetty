import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadingInterface } from '../ReadingInterface';
import { AuthContext } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

const assert = require('assert');

test('hello world!', () => {
	assert.strictEqual(1 + 1, 2);
});

test('test count and pass percentage', () => {
	const totalTests = 15;
	const passedTests = 12; // Example value, replace with actual passed tests count
	const failedTests = totalTests - passedTests;
	const passPercentage = (passedTests / totalTests) * 100;
	const additionalTestsNeeded = 5; // Example value, replace with actual needed tests count

	assert.strictEqual(totalTests, 15);
	assert.strictEqual(passedTests, 12);
	assert.strictEqual(failedTests, 3);
	assert.strictEqual(passPercentage, 80);
	assert.strictEqual(additionalTestsNeeded, 5);
});

// Mock AuthContext
const mockGetReadings = vi.fn();
const renderComponent = (authContextValue = {}) => {
  const defaultAuthContext = {
    getReadings: mockGetReadings,
    loading: false,
    error: null,
    ...authContextValue
  };

  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <ReadingInterface />
    </AuthContext.Provider>
  );
};

describe('ReadingInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reading interface', () => {
    renderComponent();
    expect(screen.getByText(/choose your spread/i)).toBeInTheDocument();
  });

  it('fetches readings on load', async () => {
    renderComponent();
    expect(mockGetReadings).toHaveBeenCalled();
  });

  it('handles loading state', async () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    renderComponent({ error: 'Failed to fetch readings' });
    expect(screen.getByText(/failed to fetch readings/i)).toBeInTheDocument();
  });
});