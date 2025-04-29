import { clerkMiddleware } from "@clerk/astro/server";
import type { APIContext } from "astro";

export const onRequest = clerkMiddleware(({ auth, context }) => {
  // Get the current path
  const url = new URL(context.request.url);
  const path = url.pathname;
  const siteId = extractSiteId(path);
  
  // Paths that require a valid magic link session
  if (
    path.startsWith('/site-hq') ||           // User dashboard/HQ (90s style!)
    path.startsWith('/playground') ||        // Builder experience
    (siteId && path.includes('/__edit__/'))  // Content editing interface
  ) {
    // Protect these routes - requires valid magic link session
    auth.protect();
  }
  
  // Add session and site info to context if available
  // Using stronger check for both sessionId AND userId
  const { sessionId, userId } = auth;
  
  if (sessionId && userId) {
    context.locals.sessionId = sessionId;
    context.locals.userId = userId;
    if (siteId) {
      context.locals.siteId = siteId;
    }
  }
});

// Helper to extract site ID from various URL patterns
function extractSiteId(path: string): string | null {
  // Match patterns like /site/abc123/__edit__/
  const editMatch = path.match(/\/site\/([^\/]+)\/__edit__\//);
  if (editMatch) return editMatch[1];
  
  // Match patterns like /site-hq/site/abc123
  const hqMatch = path.match(/\/site-hq\/site\/([^\/]+)/);
  if (hqMatch) return hqMatch[1];
  
  return null;
}