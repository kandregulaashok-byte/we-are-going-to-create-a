const hits = new Map();

function rateLimited(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0];
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (rateLimited(req)) return res.status(204).end();
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
