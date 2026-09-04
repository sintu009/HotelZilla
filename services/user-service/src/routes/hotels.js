const router = require("express").Router();
const auth = require("../middleware/auth");
const { searchHotels, getHotelById, registerHotel } = require("../controllers/hotelsController");
const validate = require("../../../shared/middleware/validate");
const { searchHotels: searchSchema, idParam } = require("../../../shared/validators/userSchemas");

router.post("/register",  auth, registerHotel);
router.get("/",    validate(searchSchema),       searchHotels);
router.get("/:id", validate({ params: idParam }), getHotelById);

module.exports = router;
