module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const clean = {
      path: String(body.path || "").slice(0, 160),
      message: String(body.message || "").slice(0, 300),
      source: String(body.source || "").slice(0, 160),
      line: Number(body.line || 0) || 0
    };
    console.error("client_error", clean);
  } catch (_) {}
  res.status(204).end();
};
