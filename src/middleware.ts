// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrlFromEnv = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKeyFromEnv = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // Log the environment variables to see if they are loaded
  console.log(`[Middleware] Attempting to read env vars for: ${context.url.pathname}`);
  console.log(`[Middleware] PUBLIC_SUPABASE_URL: ${supabaseUrlFromEnv}`);
  console.log(`[Middleware] PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKeyFromEnv ? 'Loaded (ends with ' + supabaseAnonKeyFromEnv.slice(-6) + ')' : 'MISSING or EMPTY'}`);

  if (!supabaseUrlFromEnv || !supabaseAnonKeyFromEnv) {
    console.error("[Middleware] FATAL: Supabase URL or Anon Key is UNDEFINED or EMPTY in middleware. Check .env file and server restart.");
    // Consider returning a proper error response to the client
    return new Response("Server configuration error.", { status: 500 });
  }

  const supabaseServerClient = createServerClient(
    supabaseUrlFromEnv!,
    supabaseAnonKeyFromEnv!,
    {
      cookies: {
        get(key: string) {
          return context.cookies.get(key)?.value;
        },
        set(key: string, value: string, options: CookieOptions) {
          context.cookies.set(key, value, options);
        },
        remove(key: string, options: CookieOptions) {
          context.cookies.delete(key, options);
        },
      },
    }
  );

  const { data: { session } } = await supabaseServerClient.auth.getSession();

  if (session) {
    console.log(`[Middleware] Session check complete. Session FOUND for ${context.url.pathname}. User: ${session.user.email} (ID: ${session.user.id})`);

    // --- START: ADDED PROFILE CREATION LOGIC ---
    // Check if a profile exists for this user, if not, create one.
    // This logic runs every time a user with a session hits the middleware.
    // The .maybeSingle() ensures it doesn't error if no profile is found yet.
    const { data: profile, error: profileError } = await supabaseServerClient
        .from('profiles') // Your public.profiles table
        .select('id')    // We only need to know if it exists
        .eq('id', session.user.id)
        .maybeSingle();

    if (profileError) {
        // Log the error but don't necessarily block the request unless it's critical
        console.error(`[Middleware] Error checking for profile for user ${session.user.id}:`, profileError.message);
    } else if (!profile) {
        // No profile exists, so let's create one.
        console.log(`[Middleware] No profile found for user ${session.user.id} (${session.user.email}). Creating one.`);
        const { error: createProfileError } = await supabaseServerClient
            .from('profiles')
            .insert({
                id: session.user.id,
                email: session.user.email, // Storing email for convenience
                display_name: session.user.email?.split('@')[0] || `User_${session.user.id.substring(0, 8)}` // Default display name
                // Add other default fields for your profile here if needed
            });

        if (createProfileError) {
            console.error(`[Middleware] Error creating profile for user ${session.user.id}:`, createProfileError.message);
            // Depending on how critical profile creation is, you might handle this error more explicitly.
        } else {
            console.log(`[Middleware] Profile created successfully for user ${session.user.id}`);
        }
    } else {
        // Profile already exists
        console.log(`[Middleware] Profile already exists for user ${session.user.id}`);
    }
    // --- END: ADDED PROFILE CREATION LOGIC ---

  } else {
    console.log(`[Middleware] Session check complete. No session found for ${context.url.pathname}.`);
  }

  // Make Supabase client and session (which might be null) available in Astro.locals
  context.locals.supabase = supabaseServerClient;
  context.locals.session = session;

  const protectedRoutes = ['/portal', '/wizard']; // Add any other routes that need auth
  const isProtectedRoute = protectedRoutes.some(route =>
    context.url.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log(`[Middleware] Path ${context.url.pathname} IS a protected route.`);
    if (!session) {
      console.log(`[Middleware] No session for protected route ${context.url.pathname}. Redirecting to /hello.`);
      return context.redirect(new URL('/hello', context.url.origin).toString());
    } else {
      console.log(`[Middleware] Session found. Allowing access to protected route ${context.url.pathname}.`);
    }
  } else {
    console.log(`[Middleware] Path ${context.url.pathname} is NOT a protected route.`);
  }

  return next();
});