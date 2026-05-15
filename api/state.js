const { put, list } = require('@vercel/blob');

const STATE_PATH = 'admin/state.json';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const listed = await list({ prefix: STATE_PATH, limit: 1 });
      if (!listed.blobs || listed.blobs.length === 0) {
        return res.status(200).json({ ok: true, state: null });
      }

      const blob = listed.blobs[0];
      const response = await fetch(blob.url, { cache: 'no-store' });
      const data = await response.json();
      return res.status(200).json({ ok: true, state: data.state || null });
    } catch (error) {
      return res.status(200).json({ ok: true, state: null });
    }
  }

  if (req.method === 'POST') {
    try {
      const { state } = req.body || {};
      if (!state || typeof state !== 'object') {
        return res.status(400).json({ ok: false, error: 'Invalid state payload' });
      }

      await put(STATE_PATH, JSON.stringify({ state }), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
      });

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message || 'State save failed' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
