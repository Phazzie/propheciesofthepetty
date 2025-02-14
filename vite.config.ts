/**
 * Vite configuration
 * @module vite.config
 * 
 * @description
 * Configuration for Vite build tool:
 * - React plugin setup
 * - Build optimization
 * - Development server
 * - Environment handling
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration object
 * 
 * Features:
 * - React plugin integration
 * - Dependency optimization
 * - Build configuration
 * 
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});