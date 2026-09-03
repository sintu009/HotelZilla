const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { updateBookingStatus, paginationQuery } = require("../../../shared/validators/adminSchemas");
const { getAllBookings, updateBookingStatus: updateStatus } = require("../controllers/bookingsController");

router.get("/",             auth, validate(paginationQuery), getAllBookings);
router.patch("/:id/status", auth, validate(updateBookingStatus), updateStatus);

module.exports = router;
