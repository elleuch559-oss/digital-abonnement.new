const { valid, readData, writeData } = require("./_lib");

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");
      return res.status(200).json({ data: await readData() });
    }
    if (req.method === "PUT") {
      res.setHeader("Cache-Control", "no-store");
      if (!valid(req)) return res.status(401).json({ error: "unauthorized" });
      const d = req.body && req.body.data;
      if (!d || !d.settings || !Array.isArray(d.products) || !Array.isArray(d.payments) || JSON.stringify(d).length > 4e6) {
        return res.status(400).json({ error: "bad_data" });
      }
      await writeData(d);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
};
