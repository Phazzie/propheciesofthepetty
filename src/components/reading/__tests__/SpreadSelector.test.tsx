import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpreadSelector, SpreadType } from '../SpreadSelector';

describe('SpreadSelector', () => {
  it('selects a spread', () => {
    const onSelect = jest.fn();
    render(<SpreadSelector onSelect={onSelect} selectedSpread={null} />);
    
    fireEvent.click(screen.getByText(/past-present-future/i));
    expect(onSelect).toHaveBeenCalledWith('past-present-future' as SpreadType);
  });
});