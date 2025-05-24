// test-db.mjs
import pg from 'pg';
const { Pool } = pg;

async function testConnection() {
  const connectionString = 'postgres://twoninedb_user:uZd0mSZOwa6tMY58GMao9QWjArV8F58R@dpg-d085a6fgi27c73860p1g-a.oregon-postgres.render.com/twoninedb';
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connection successful:', result.rows[0]);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();