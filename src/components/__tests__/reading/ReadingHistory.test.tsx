import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadingHistory } from '../../reading/ReadingHistory';
import { useAuth } from '../../../context/AuthContext';
import { useReadings } from '../../../hooks/useDatabase';
import type { Reading } from '../../../types';

// Mock the hooks
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../../hooks/useDatabase', () => ({
  useReadings: vi.fn()
}));

describe('ReadingHistory', () => {
  const mockReadings: Reading[] = [
    {
      id: 'reading-1',
      userId: 'user-1',
      createdAt: '2024-01-20T12:00:00Z',
      spreadType: 'classic',
      cards: [
        {
          id: 'tower',
          name: 'The Tower',
          position: 1,
          isReversed: false,
          imageUrl: '/cards/tower.jpg',
          type: 'major',
          description: 'Change comes whether you\'re ready or not.'
        }
      ],
      interpretation: {
        text: "Your reading reveals...",
        scores: {
          subtlety: 85,
          relatability: 82,
          wisdom: 80,
          creative: 85,
          humor: 88,
          snark: 85,
          culturalResonance: 75,
          metaphorMastery: 80,
          shadeIndex: {
            plausibleDeniability: 75,
            guiltTripIntensity: 72,
            emotionalManipulation: 78,
            backhandedCompliments: 85,
            strategicVagueness: 80
          }
        }
      }
    },
    {
      id: 'reading-2',
      userId: 'user-1',
      createdAt: '2024-01-19T12:00:00Z',
      spreadType: 'classic',
      cards: [{
        id: 'hermit',
        name: 'The Hermit',
        position: 2,
        isReversed: true,
        imageUrl: '/cards/hermit.jpg',
        type: 'major',
        description: 'Sometimes isolation isn\'t wisdom.'
      }],
      interpretation: {
        text: "Another reading...",
        scores: {
          subtlety: 75, // Below passing
          relatability: 82,
          wisdom: 78, // Below passing
          creative: 85,
          humor: 88,
          snark: 85,
          culturalResonance: 75,
          metaphorMastery: 80,
          shadeIndex: {
            plausibleDeniability: 35,
            guiltTripIntensity: 40,
            emotionalManipulation: 35,
            backhandedCompliments: 38,
            strategicVagueness: 32
          }
        }
      }
    }
  ];

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' }
    });

    (useReadings as any).mockReturnValue({
      getUserReadings: vi.fn().mockResolvedValue(mockReadings),
      loading: false,
      error: null
    });
  });

  it('displays reading history with score summaries', () => {
    render(<ReadingHistory />);
    
    expect(screen.getByText(/The Tower/)).toBeInTheDocument();
    expect(screen.getByText(/The Hermit/)).toBeInTheDocument();
    
    // Should show passing/failing status
    const readings = screen.getAllByRole('article');
    expect(readings[0]).toHaveTextContent(/passing/i);
    expect(readings[1]).toHaveTextContent(/needs improvement/i);
  });

  it('shows shade level progression', () => {
    render(<ReadingHistory />);
    
    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]);
    
    expect(screen.getByText(/Level 7/)).toBeInTheDocument();
    
    // Go back and check second reading
    fireEvent.click(screen.getByText(/back/i));
    fireEvent.click(viewButtons[1]);
    
    expect(screen.getByText(/Level [3-4]/)).toBeInTheDocument();
    expect(screen.getByText(/Clear undertones of judgment/i)).toBeInTheDocument();
  });

  it('filters readings by search term', () => {
    render(<ReadingHistory />);
    
    const searchInput = screen.getByPlaceholderText(/search readings/i);
    fireEvent.change(searchInput, { target: { value: 'tower' } });
    
    expect(screen.getByText(/The Tower/)).toBeInTheDocument();
    expect(screen.queryByText(/The Hermit/)).not.toBeInTheDocument();
  });

  it('sorts readings by date', () => {
    render(<ReadingHistory />);
    
    const sortButton = screen.getByText(/newest first/i);
    fireEvent.click(sortButton);
    
    const readings = screen.getAllByRole('article');
    expect(readings[0]).toHaveTextContent(/The Tower/);
    
    fireEvent.click(sortButton);
    const reorderedReadings = screen.getAllByRole('article');
    expect(reorderedReadings[0]).toHaveTextContent(/The Hermit/);
  });
});

const assert = require('assert');

test('hello world!', () => {
	assert.strictEqual(1 + 1, 2);
});

test('test statistics', () => {
	const totalTests = 15;
	const passedTests = 10; // Replace with actual passed tests count
	const failedTests = totalTests - passedTests;
	const percentagePass = (passedTests / totalTests) * 100;
	const additionalTestsNeeded = 5; // Replace with actual number needed

	assert.strictEqual(totalTests, 15);
	assert.strictEqual(passedTests + failedTests, totalTests);
	assert.strictEqual(percentagePass, (passedTests / totalTests) * 100);
	assert.strictEqual(additionalTestsNeeded, 5);
});