// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  let message = "Supabase URL or Anon Key is missing. ";
  message += "Make sure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set in your .env file.";
  if (typeof window === 'undefined') {
    console.error("FATAL ERROR (server-side): " + message);
  }
  throw new Error(message);
}

// This client is for:
// 1. Server-side calls in .astro pages that DON'T need cookie-based session context (e.g., signInWithOtp).
// 2. Client-side scripts (though the callback page initializes its own).
export const supabase = createClient(supabaseUrl, supabaseAnonKey)