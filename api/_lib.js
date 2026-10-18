const crypto = require("crypto");

const SECRET = () => process.env.SESSION_SECRET || "";
const sign = (p) => crypto.createHmac("sha256", SECRET()).update(p).digest("base64url");

function makeToken(days) {
  const p = Buffer.from(JSON.stringify({ exp: Date.now() + days * 864e5 })).toString("base64url");
  return p + "." + sign(p);
}

function valid(req) {
  const m = (req.headers.cookie || "").match(/(?:^|;\s*)adm=([^;]+)/);
  if (!m || !SECRET()) return false;
  const [p, s] = m[1].split(".");
  if (!p || !s) return false;
  const a = Buffer.from(s), b = Buffer.from(sign(p));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(p, "base64url").toString()).exp > Date.now(); }
  catch (e) { return false; }
}

function db() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    url: process.env.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/site_content",
    h: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" },
  };
}

async function readData() {
  const { url, h } = db();
  const r = await fetch(url + "?id=eq.1&select=data", { headers: h });
  if (!r.ok) throw new Error("db_read_" + r.status);
  const rows = await r.json();
  return rows[0] ? rows[0].data : null;
}

async function writeData(data) {
  const { url, h } = db();
  const r = await fetch(url + "?on_conflict=id", {
    method: "POST",
    headers: Object.assign({}, h, { Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({ id: 1, data: data, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("db_write_" + r.status);
}

module.exports = { crypto, makeToken, valid, readData, writeData };
