const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, type, dataUrl } = req.body || {};
    if (!name || !dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing upload payload' });
    }

    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ ok: false, error: 'Invalid dataUrl format' });
    }

    const contentType = type || match[1] || 'application/octet-stream';
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');
    const safeName = `${Date.now()}-${name}`.replace(/[^a-zA-Z0-9._-]/g, '-');

    const blob = await put(`uploads/${safeName}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true
    });

    return res.status(200).json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Upload failed' });
  }
};
