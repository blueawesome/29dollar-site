import type { APIRoute } from 'astro';
import { logEvent } from '../../lib/logEvent';

export const GET: APIRoute = async () => {
  try {
    await logEvent(
      'test-user-123',  // fake user ID for now
      'test_event',     // event type
      { testField: 'testValue' } // payload
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging event:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500 }
    );
  }
};
