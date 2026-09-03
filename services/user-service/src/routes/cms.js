const router = require("express").Router();
const db = require("../config/db");

// Homepage CMS content
router.get("/homepage", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM cms_content WHERE section='homepage' LIMIT 1");
    res.json(rows[0]?.data || {});
  } catch { res.json({}); }
});

// Featured destinations
router.get("/destinations", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM cms_destinations WHERE is_active=true ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch { res.json([]); }
});

// Promotional offers
router.get("/offers", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM cms_offers WHERE is_active=true ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch { res.json([]); }
});

module.exports = router;
