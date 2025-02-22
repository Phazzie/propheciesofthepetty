import type { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';

export interface MockCard {
  name: string;
  // Add other card properties as needed
}

export function createMockCard(): MockCard {
  return {
    name: 'Test Card'
  };
}

type RenderResult = ReturnType<typeof rtlRender>;

export function renderComponent(ui: ReactElement): RenderResult {
  return rtlRender(ui);
}