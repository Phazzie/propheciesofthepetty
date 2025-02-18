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
      exclude: ['**/node_modules/**', '**/__tests__/**']
    },
    deps: {
      optimizer: {
        web: {
          include: ['msw']
        }
      }
    },
    pool: 'forks',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 10000,
    maxConcurrency: 1,
    reporters: ['verbose']
  }
});