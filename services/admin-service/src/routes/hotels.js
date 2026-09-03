const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { updateHotelStatus, paginationQuery } = require("../../../shared/validators/adminSchemas");
const { getAllHotels, getHotelById, updateHotelStatus: updateStatus, createHotel, updateHotel, getRooms, addRoom, updateRoom, deleteRoom, toggleHotelOpen, deleteHotel } = require("../controllers/hotelsController");

router.get("/",                   auth, validate(paginationQuery), getAllHotels);
router.post("/",                  auth, createHotel);
router.get("/:id/rooms",          auth, getRooms);
router.post("/:id/rooms",         auth, addRoom);
router.get("/:id",                auth, getHotelById);
router.patch("/:id/status",       auth, validate(updateHotelStatus), updateStatus);
router.patch("/:id/toggle-open",  auth, toggleHotelOpen);
router.patch("/:id",              auth, updateHotel);
router.delete("/:id",             auth, deleteHotel);
router.put("/rooms/:roomId",      auth, updateRoom);
router.delete("/rooms/:roomId",   auth, deleteRoom);

module.exports = router;
