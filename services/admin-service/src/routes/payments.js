const router = require("express").Router();
const auth = require("../middleware/auth");
const { getAllPayments, processRefund } = require("../controllers/paymentsController");

router.get("/", auth, getAllPayments);
router.post("/:id/refund", auth, processRefund);

module.exports = router;
