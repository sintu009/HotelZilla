const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../config/db");

// Public homepage (no auth — used by main frontend)
router.get("/public/homepage", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM cms_content WHERE section='homepage' LIMIT 1");
    res.json(rows[0]?.data || {});
  } catch (err) { next(err); }
});

// Homepage content
router.get("/homepage", auth, async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM cms_content WHERE section='homepage' LIMIT 1");
    res.json(rows[0]?.data || {});
  } catch (err) { next(err); }
});

router.put("/homepage", auth, async (req, res, next) => {
  try {
    await db.query(
      `INSERT INTO cms_content (section, data) VALUES ('homepage', $1)
       ON CONFLICT (section) DO UPDATE SET data=$1, updated_at=NOW()`,
      [JSON.stringify(req.body)]
    );
    res.json({ message: "Saved" });
  } catch (err) { next(err); }
});

// Public destinations (no auth — used by main frontend)
router.get("/public/destinations", async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT d.*, COUNT(h.id)::int AS hotel_count
      FROM cms_destinations d
      LEFT JOIN hotels h ON LOWER(h.city) = LOWER(d.name) AND h.status = 'approved'
      WHERE d.is_active = TRUE
      GROUP BY d.id
      ORDER BY d.display_order ASC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// Public offers (no auth — used by main frontend)
router.get("/public/offers", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM cms_offers WHERE is_active=TRUE ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// Destinations
router.get("/destinations", auth, async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM cms_destinations ORDER BY display_order ASC");
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/destinations", auth, async (req, res, next) => {
  const { name, country, image_url, display_order, is_active } = req.body;
  try {
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM cms_destinations");
    if (parseInt(countRows[0].count) >= 5)
      return res.status(400).json({ message: "Maximum 5 destinations allowed." });
    const { rows } = await db.query(
      "INSERT INTO cms_destinations (name, country, image_url, hotel_count, display_order, is_active) VALUES ($1,$2,$3,0,$4,$5) RETURNING *",
      [name, country || "India", image_url, display_order || 0, is_active !== false]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.patch("/destinations/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { name, country, image_url, display_order, is_active } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE cms_destinations SET
        name=COALESCE($1,name), country=COALESCE($2,country), image_url=COALESCE($3,image_url),
        display_order=COALESCE($4,display_order), is_active=COALESCE($5,is_active)
       WHERE id=$6 RETURNING *`,
      [name, country, image_url, display_order, is_active, id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete("/destinations/:id", auth, async (req, res, next) => {
  try {
    await db.query("DELETE FROM cms_destinations WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

// Offers (promotional banners)
router.get("/offers", auth, async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM cms_offers ORDER BY display_order ASC");
    res.json(rows);
  } catch (err) { next(err); }
});

router.post("/offers", auth, async (req, res, next) => {
  const { title, description, code, image_url, display_order, is_active } = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO cms_offers (title, description, code, image_url, display_order, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [title, description, code, image_url, display_order || 0, is_active !== false]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.patch("/offers/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { title, description, code, image_url, display_order, is_active } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE cms_offers SET
        title=COALESCE($1,title), description=COALESCE($2,description), code=COALESCE($3,code),
        image_url=COALESCE($4,image_url), display_order=COALESCE($5,display_order), is_active=COALESCE($6,is_active)
       WHERE id=$7 RETURNING *`,
      [title, description, code, image_url, display_order, is_active, id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete("/offers/:id", auth, async (req, res, next) => {
  try {
    await db.query("DELETE FROM cms_offers WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
