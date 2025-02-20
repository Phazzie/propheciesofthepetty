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
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/__tests__/**',
        '**/types/**',
        '**/vite-env.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
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
        minThreads: 2,
        maxThreads: 4,
        singleThread: false
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    maxConcurrency: 4,
    reporters: ['verbose', 'junit'],
    outputFile: {
      junit: './coverage/junit.xml'
    }
  }
});