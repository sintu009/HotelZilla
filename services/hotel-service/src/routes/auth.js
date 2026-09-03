const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const validate = require("../../../shared/middleware/validate");
const { register: registerSchema, login: loginSchema } = require("../../../shared/validators/hotelSchemas");

router.post("/register", validate(registerSchema), register);
router.post("/login",    validate(loginSchema),    login);

module.exports = router;
