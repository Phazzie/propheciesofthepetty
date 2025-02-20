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
import { env } from './src/lib/env';

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
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: mode === 'development',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          tarot: ['@google/generative-ai', '@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 3000,
    strictPort: true
  }
}));