const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { updateBookingStatus, idParam } = require("../../../shared/validators/hotelSchemas");
const { getHotelBookings, updateBookingStatus: updateStatus } = require("../controllers/bookingsController");

router.get("/",             auth,                              getHotelBookings);
router.patch("/:id/status", auth, validate(updateBookingStatus), updateStatus);

module.exports = router;
