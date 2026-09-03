const router = require("express").Router();
const auth = require("../middleware/auth");
const { getEarnings } = require("../controllers/earningsController");
router.get("/", auth, getEarnings);
module.exports = router;
