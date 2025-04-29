import { Pool } from 'pg';
import type { APIRoute } from 'astro';

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const GET: APIRoute = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return new Response(
      JSON.stringify({ time: result.rows[0].now }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Database connection failed' }),
      { status: 500 }
    );
  }
};
