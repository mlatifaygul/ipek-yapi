const { Pool } = require('pg');
const STATE_KEY = 'global';
let pool;

function normalizeStatePayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object') return null;
  if (rawPayload.state && typeof rawPayload.state === 'object') return rawPayload.state;
  return rawPayload;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function ensureStateTable() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_state (
      state_key TEXT PRIMARY KEY,
      state JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'GET') {
    try {
      await ensureStateTable();
      const db = getPool();
      const result = await db.query(
        `
        SELECT state
        FROM site_state
        WHERE state_key = $1
        LIMIT 1
      `,
        [STATE_KEY]
      );
      if (!result.rows || result.rows.length === 0) {
        return res.status(200).json({ ok: true, state: null });
      }
      return res.status(200).json({ ok: true, state: normalizeStatePayload(result.rows[0].state) });
    } catch (error) {
      return res.status(200).json({ ok: true, state: null });
    }
  }

  if (req.method === 'POST') {
    try {
      const state = normalizeStatePayload(req.body && req.body.state ? req.body : req.body);
      if (!state || typeof state !== 'object' || Array.isArray(state)) {
        return res.status(400).json({ ok: false, error: 'Invalid state payload' });
      }

      await ensureStateTable();
      const db = getPool();
      await db.query(
        `
        INSERT INTO site_state (state_key, state, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (state_key)
        DO UPDATE SET
          state = EXCLUDED.state,
          updated_at = NOW()
      `,
        [STATE_KEY, JSON.stringify(state)]
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message || 'State save failed' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
