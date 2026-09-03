const router = require("express").Router();
const auth = require("../middleware/auth");
const { getAllCustomers, toggleCustomerStatus } = require("../controllers/customersController");
const { getOwnerById } = require("../controllers/ownersController");

router.get("/", auth, getAllCustomers);
router.get("/owners/:id", auth, getOwnerById);
router.patch("/:id/toggle", auth, toggleCustomerStatus);

module.exports = router;
