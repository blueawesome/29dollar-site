// src/pages/api/clerk-webhook.ts
import type { APIRoute } from "astro";
import { query } from "../../lib/db";
import { logEvent } from "../../lib/logEvent";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the webhook data
    const payload = await request.json();
    
    // Extract the event type and data
    const eventType = payload.type;
    const data = payload.data;
    
    console.log(`Received webhook: ${eventType}`);
    
    // Handle different event types
    switch (eventType) {
      case "user.created":
        await logEvent({
          user_id: data.id,
          type: "user_signup",
          payload: {
            email: data.email_addresses?.[0]?.email_address || "unknown",
            created_at: data.created_at
          }
        });
        break;
        
      case "session.created":
        await logEvent({
          user_id: data.user_id,
          type: "user_login",
          payload: {
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
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Error processing webhook" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};