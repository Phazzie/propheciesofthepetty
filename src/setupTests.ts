import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import '@testing-library/jest-dom';
import { TestTracker } from './tests/testTracker';
import { SystemValidator } from './lib/SystemValidator';

// Create a type-safe coverage object
declare global {
  var __coverage__: number | undefined;
}

// Increase the heap size for the test environment
if (typeof global.gc === 'function') {
  beforeAll(() => {
    if (typeof global.gc === 'function') {
      global.gc();
    }
  });
}

// Mock console.error to avoid noisy test output
const originalError = console.error;
vi.spyOn(console, 'error').mockImplementation((...args) => {
  if (args[0]?.includes('Warning:')) return;
  originalError.apply(console, args);
});

// Mock window.matchMedia for DOM tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

// Clean up after each test
afterEach(() => {
  cleanup();
  if (server?.resetHandlers) {
    server.resetHandlers();
  }
  vi.clearAllMocks();
  if (typeof global.gc === 'function') {
    global.gc();
  }
});

afterAll(() => {
  if (server?.close) {
    server.close();
  }
});

// Track test results and validate system
afterAll(() => {
  // Update test status
  const testResults = {
    coverage: global.__coverage__ ?? 0,
    failedTests: [],
    flakyTests: [],
    lastRun: new Date()
  };

  TestTracker.updateTestStatus(testResults);

  // Run system validation
  const validationResult = SystemValidator.validateSystem();
  if (!validationResult.passed) {
    console.warn('System validation failed:', 
      validationResult.failures.map(f => `\n- ${f.category}: ${f.issue}`).join('')
    );
  }
});