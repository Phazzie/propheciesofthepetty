/**
 * Supabase client configuration and utilities
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase client instance
 * Configured with environment variables and type safety
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);