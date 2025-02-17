import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpreadSelector } from '../SpreadSelector';

describe('SpreadSelector', () => {
  it('selects a spread', () => {
    const onSelect = vi.fn();
    render(<SpreadSelector onSelect={onSelect} selectedSpread={null} />);
    
    // Find and click the Past, Present, Future spread button
    const ppfSpread = screen.getByRole('button', { 
      name: /past, present, future/i 
    });
    fireEvent.click(ppfSpread);
    
    // Verify the correct spread config was passed
    expect(onSelect).toHaveBeenCalledWith({
      id: 'past-present-future',
      name: 'Past, Present, Future',
      description: expect.any(String),
      cardCount: 3,
      icon: 'threeCard',
      positions: expect.any(Array)
    });
  });

  it('shows selected state correctly', () => {
    const selectedSpread = {
      id: 'past-present-future',
      name: 'Past, Present, Future',
      description: 'Test description',
      cardCount: 3,
      icon: 'threeCard',
      positions: []
    };
    
    render(<SpreadSelector onSelect={vi.fn()} selectedSpread={selectedSpread} />);
    
    // Selected spread should have special styling
    const selectedButton = screen.getByRole('button', { 
      name: /past, present, future/i 
    });
    expect(selectedButton).toHaveClass('bg-purple-600', 'text-white');
  });
});