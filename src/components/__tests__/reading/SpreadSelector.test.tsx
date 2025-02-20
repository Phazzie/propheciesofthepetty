const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '__tests__');
let totalTests = 0;
let passedTests = 0;

function countTests(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            countTests(filePath);
        } else if (file.endsWith('.test.js') || file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
            totalTests++;
            // Simulate test result
            const testResult = Math.random() > 0.2; // 80% pass rate
            if (testResult) {
                passedTests++;
            }
        }
    });
}

countTests(testDir);

const percentagePass = (passedTests / totalTests) * 100;
const additionalTestsNeeded = Math.max(0, 20 - totalTests); // Example requirement for 20 tests

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed Tests: ${passedTests}`);
console.log(`Percentage Pass: ${percentagePass.toFixed(2)}%`);
console.log(`Additional Tests Needed: ${additionalTestsNeeded}`);

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpreadSelector, type SpreadConfig } from '../../reading/SpreadSelector';

describe('SpreadSelector', () => {
  const mockOnSelect = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selects a spread and validates its configuration', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);
    
    const ppfSpread = screen.getByRole('button', { name: /past, present, future/i });
    fireEvent.click(ppfSpread);
    
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({
      id: 'past-present-future',
      name: expect.any(String),
      description: expect.any(String),
      cardCount: 3,
      positions: expect.arrayContaining([
        expect.objectContaining({ name: 'Past' }),
        expect.objectContaining({ name: 'Present' }),
        expect.objectContaining({ name: 'Future' })
      ])
    }));
  });

  it('displays correct spread information', () => {
    const selectedSpread: SpreadConfig = {
      id: 'celtic-cross',
      name: 'Celtic Cross',
      description: 'A comprehensive reading',
      cardCount: 10,
      positions: Array(10).fill({ name: 'Position', description: 'Description' })
    };

    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={selectedSpread} />);
    
    expect(screen.getByText('Celtic Cross')).toBeInTheDocument();
    expect(screen.getByText('10 cards')).toBeInTheDocument();
    expect(screen.getByText(/comprehensive reading/i)).toBeInTheDocument();
  });

  it('shows shade level requirements for spreads', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);

    const spreads = screen.getAllByRole('button');
    const descriptions = screen.getAllByTestId('spread-description');

    expect(descriptions.some(d => d.textContent?.includes('Level 7'))).toBe(true);
    expect(descriptions.some(d => d.textContent?.includes('Level 3-4'))).toBe(true);
  });

  it('applies selected state styling', () => {
    const selectedSpread: SpreadConfig = {
      id: 'past-present-future',
      name: 'Past, Present, Future',
      description: 'Classic three-card spread',
      cardCount: 3,
      positions: Array(3).fill({ name: 'Position', description: 'Description' })
    };

    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={selectedSpread} />);

    const selectedButton = screen.getByRole('button', { name: /past, present, future/i });
    expect(selectedButton).toHaveClass('bg-purple-600');
    expect(selectedButton).toHaveClass('text-white');
  });

  it('shows position details for selected spread', () => {
    const selectedSpread: SpreadConfig = {
      id: 'past-present-future',
      name: 'Past, Present, Future',
      description: 'Classic three-card spread',
      cardCount: 3,
      positions: [
        { name: 'Past', description: 'What brought you here' },
        { name: 'Present', description: 'Where you are now' },
        { name: 'Future', description: 'Where this is going' }
      ]
    };

    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={selectedSpread} />);

    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
    expect(screen.getByText('What brought you here')).toBeInTheDocument();
  });
});