/**
 * Supabase client configuration and utilities
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

/**
 * Supabase client instance
 * Configured with environment variables and type safety
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);