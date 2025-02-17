import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi, beforeAll, afterEach } from 'vitest';

beforeAll(() => {
  // Mock window.matchMedia
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn()
  }));
  // Mock fetch if necessary
  global.fetch = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore - ResizeObserver is used but not fully typed
window.ResizeObserver = MockResizeObserver;