// src/lib/logEvent.ts (UPDATED for Supabase)
import { supabase } from './supabase'; // Assuming supabase.ts is in the same src/lib/ directory

interface EventPayload {
  [key: string]: any; // Or a more specific type for your payloads
}

export async function logSupabaseEvent(
  eventType: string,
  eventPayload?: EventPayload,
  userId?: string | null // User ID can be string (UUID) or null
) {
  if (!eventType) {
    console.error('logSupabaseEvent: Event type is required.');
    return { data: null, error: { message: 'Event type is required.' } };
  }

  const { data, error } = await supabase
    .from('events') // Your 'events' table in Supabase
    .insert([
      {
        user_id: userId, // This will be the UUID from Supabase Auth
        type: eventType,
        payload: eventPayload || {}, // Ensure payload is at least an empty object
      },
    ])
    .select(); // Optionally get the inserted row back

  if (error) {
    console.error(`Error logging Supabase event (type: ${eventType}):`, error.message);
    // Consider how you want to handle this error in consuming functions
  } else if (data) {
    console.log(`Supabase event logged (type: ${eventType}):`, data[0]);
  }

  return { data, error };
}