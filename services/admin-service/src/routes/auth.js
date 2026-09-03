const router = require("express").Router();
const { login, me, logout } = require("../controllers/authController");
const validate = require("../../../shared/middleware/validate");
const { adminLogin } = require("../../../shared/validators/adminSchemas");
const auth = require("../middleware/auth");

router.post("/login",  validate(adminLogin), login);
router.get("/me",      auth, me);
router.post("/logout", auth, logout);

module.exports = router;
