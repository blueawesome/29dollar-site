// src/pages/api/auth/signout.ts (Temporary Diagnostic Version)
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect }) => {
  console.log('[API /auth/signout] Signout attempted (diagnostic version).');
  return redirect('/hello?message=Signout POC', 302);
};

// Add a GET handler as well for easy browser testing if needed for this diagnostic
export const GET: APIRoute = async ({ redirect }) => {
  console.log('[API /auth/signout] Signout GET attempted (diagnostic version).');
  return redirect('/hello?message=Signout POC GET', 302);
};