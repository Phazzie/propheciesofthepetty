/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      inline: [/\.jsx?$/, /\.tsx?$/]
    },
    css: true,
    transformMode: {
      web: [/\.[jt]sx?$/]
    },
    alias: {
      '\\.(css|less|sass|scss)$': path.resolve(__dirname, 'src/__mocks__/styleMock.js'),
      '\\.(gif|ttf|eot|svg)$': path.resolve(__dirname, 'src/__mocks__/fileMock.js')
    }
  },
});