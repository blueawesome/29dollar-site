import { query } from './db';

/**
 * Log an event into the database.
 * @param userId ID of the user associated with the event (can be null for anonymous events)
 * @param type Short event type string, e.g., "signup", "site_created", "upgrade"
 * @param payload Optional additional structured data (JSON serializable)
 */
export async function logEvent(
  userId: string | null,
  type: string,
  payload: object = {}
): Promise<void> {
  await query(
    `INSERT INTO events (user_id, type, payload) VALUES ($1, $2, $3)`,
    [userId, type, payload]
  );
}
