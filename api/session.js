const { crypto, makeToken, valid } = require("./_lib");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const cookie = (v, age) => `adm=${v}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${age}`;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") return res.status(200).json({ admin: valid(req) });
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", cookie("", 0));
    return res.status(200).json({ ok: true });
  }
  if (req.method === "POST") {
    const pw = (req.body && req.body.password) || "";
    const expected = process.env.ADMIN_PASSWORD || "";
    const ok = !!expected && !!process.env.SESSION_SECRET && crypto.timingSafeEqual(sha(pw), sha(expected));
    if (!ok) {
      await new Promise((r) => setTimeout(r, 1000));
      return res.status(401).json({ error: "bad_password" });
    }
    res.setHeader("Set-Cookie", cookie(makeToken(7), 604800));
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
};
