const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { createBooking: createSchema, idParam } = require("../../../shared/validators/userSchemas");
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/bookingsController");

router.post("/",           auth, validate(createSchema),       createBooking);
router.get("/my",          auth,                               getMyBookings);
router.patch("/:id/cancel", auth, validate({ params: idParam }), cancelBooking);

module.exports = router;
