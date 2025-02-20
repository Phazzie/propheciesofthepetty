import { validateEnv } from 'env-validator';

export interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_GEMINI_API_KEY: string;
  VITE_USE_TEST_ACCOUNT?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

const schema = {
  VITE_SUPABASE_URL: { type: 'string', required: true },
  VITE_SUPABASE_ANON_KEY: { type: 'string', required: true },
  VITE_GEMINI_API_KEY: { type: 'string', required: true },
  VITE_USE_TEST_ACCOUNT: { type: 'string', required: false },
  NODE_ENV: { type: 'string', enum: ['development', 'production', 'test'], required: true }
};

export const env = validateEnv<Env>(schema, process.env);