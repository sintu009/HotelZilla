const router = require("express").Router();
const auth = require("../middleware/auth");
const { getAllReviews, deleteReview } = require("../controllers/reviewsController");

router.get("/", auth, getAllReviews);
router.delete("/:id", auth, deleteReview);

module.exports = router;
