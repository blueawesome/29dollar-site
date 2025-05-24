// src/pages/api/auth/set-cookie.ts
import type { APIRoute } from 'astro';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Access token and refresh token are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with cookie handling for this server-side operation
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY!, // ANON key is fine for setSession if RLS permits
      // If you have row-level security that needs the service_role for some user table access
      // during setSession (unlikely for just setting auth cookies), you might need service_role here.
      // But for auth.setSession itself, ANON_KEY + user tokens should be what's needed.
      {
        cookies: {
          get(key: string) {
            return cookies.get(key)?.value;
          },
          set(key: string, value: string, options: CookieOptions) {
            cookies.set(key, value, options);
          },
          remove(key: string, options: CookieOptions) {
            cookies.delete(key, options);
          },
        },
      }
    );

    // Set the session using the provided tokens.
    // This will validate the tokens with Supabase and set the appropriate auth cookies.
    const { error: setError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (setError) {
      console.error('[API /set-cookie] Error setting session:', setError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to set session with Supabase.', details: setError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API /set-cookie] Session cookies set successfully.');
    return new Response(
      JSON.stringify({ message: 'Session cookies set successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (e: any) {
    console.error('[API /set-cookie] Exception:', e.message);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.', details: e.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};