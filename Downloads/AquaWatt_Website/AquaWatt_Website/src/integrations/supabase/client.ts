import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase URL and anon key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wbkmlltglyqnszlkzeot.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6India21sbHRnbHlxbnN6bGt6ZW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MzIxOTYsImV4cCI6MjA3NDQwODE5Nn0.7ecUrwLZGKTrxY4sZRHEV-YYx8_Nd1SmKpD8KRKBgMc";

// Debug logging
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Create Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});