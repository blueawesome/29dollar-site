// src/pages/api/test-database.ts
import type { APIRoute } from 'astro';
import { Pool } from 'pg';

export const POST: APIRoute = async () => {
  // Create a one-time pool with the explicit connection string
  const pool = new Pool({
    connectionString: 'postgres://twoninedb_user:uZd0mSZOwa6tMY58GMao9QWjArV8F58R@dpg-d085a6fgi27c73860p1g-a.oregon-postgres.render.com/twoninedb',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Create a test event in the database
    const result = await pool.query(
      'INSERT INTO events (user_id, type, payload) VALUES ($1, $2, $3) RETURNING *',
      ['test-user-123', 'test_event', JSON.stringify({ testField: 'testValue' })]
    );

    // Close the pool after we're done
    await pool.end();

    return new Response(JSON.stringify({
      success: true,
      message: 'Test event created successfully',
      data: result.rows[0]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    // Make sure to close the pool even on error
    try {
      await pool.end();
    } catch (e) {
      console.error('Error closing pool:', e);
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Database test failed',
      error: String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}