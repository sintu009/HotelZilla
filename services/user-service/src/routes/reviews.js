const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { addReview: addReviewSchema } = require("../../../shared/validators/userSchemas");
const { addReview } = require("../controllers/reviewsController");

router.post("/", auth, validate(addReviewSchema), addReview);

module.exports = router;
