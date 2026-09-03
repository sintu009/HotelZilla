const router = require("express").Router();
const auth = require("../middleware/auth");
const { getStats, getWeeklyBookings } = require("../controllers/dashboardController");

router.get("/stats", auth, getStats);
router.get("/weekly-bookings", auth, getWeeklyBookings);

module.exports = router;
