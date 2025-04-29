import { Pool } from 'pg';

declare global {
  // This ensures hot reloads in dev don't create new pools constantly
  var __dbPool: Pool | undefined;
}

const pool =
  globalThis.__dbPool ??
  new Pool({
    connectionString: import.meta.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Render/Postgres expects SSL
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__dbPool = pool;
}

/**
 * Run a database query.
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result rows
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows;
}
