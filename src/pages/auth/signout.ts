// src/pages/auth/signout.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ redirect, cookies }) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    // You might want to inform the user, but still redirect
    return redirect('/hello?error=signout_failed', 302);
  }

  // Supabase client SDK handles clearing its own storage (localStorage).
  // If you were setting session cookies manually with Astro middleware, clear them here.
  // e.g., cookies.delete('my-auth-cookie', { path: '/' });

  return redirect('/hello?message=Successfully signed out', 302);
};