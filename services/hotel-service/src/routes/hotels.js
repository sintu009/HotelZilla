const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { createHotel, updateHotel, addRoom, updateRoom, idParam, hotelParam } = require("../../../shared/validators/hotelSchemas");
const { getMyHotels, createHotel: create, updateHotel: update, toggleHotelOpen } = require("../controllers/hotelsController");
const { getRooms, addRoom: add, updateRoom: updateR } = require("../controllers/roomsController");

router.get("/",                        auth,                              getMyHotels);
router.post("/",                       auth, validate(createHotel),       create);
router.patch("/:id/toggle-open",       auth,                              toggleHotelOpen);
router.put("/:id",                     auth, validate(updateHotel),       update);
router.get("/:hotel_id/rooms",         auth, validate({ params: hotelParam }), getRooms);
router.post("/:hotel_id/rooms",        auth, validate(addRoom),           add);
router.put("/rooms/:id",               auth, validate(updateRoom),        updateR);

module.exports = router;
