/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      optimizer: {
        web: {
          include: ['msw']
        }
      }
    },
    pool: 'forks', // Use process pool instead of threads
    poolOptions: {
      threads: {
        singleThread: true // Run in single thread to reduce memory usage
      }
    },
    testTimeout: 10000, // Increase timeout to 10s
    maxConcurrency: 1 // Run tests serially
  },
});