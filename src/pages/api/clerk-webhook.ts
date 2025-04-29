// src/pages/api/clerk-webhook.ts
import type { APIRoute } from "astro";
import { logEvent } from "../../lib/logEvent";

export const POST: APIRoute = async ({ request }) => {
  // Get the webhook data from Clerk
  const payload = await request.json();
  
  // Verify webhook (in production you'd verify using Clerk's signature)
  // For now, we'll assume the webhook is legitimate
  
  // Extract the event type and data
  const eventType = payload.type;
  const data = payload.data;
  
  // Handle different event types
  switch (eventType) {
    case "user.created":
      await logEvent({
        user_id: data.id,
        type: "user_signup",
        payload: {
          email: data.email_addresses?.[0]?.email_address || "unknown",
          first_name: data.first_name,
          created_at: data.created_at
        }
      });
      break;
      
    case "session.created":
      await logEvent({
        user_id: data.user_id,
        type: "user_login",
        payload: {
          device: data.device || "unknown",
          browser: data.browser || "unknown",
          timestamp: new Date().toISOString()
        }
      });
      break;
      
    // Add more event types as needed
  }
  
  // Return a success response
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};