const router = require("express").Router();
const { register, login, me, logout } = require("../controllers/authController");
const auth = require("../middleware/auth");
const validate = require("../../../shared/middleware/validate");
const { register: registerSchema, login: loginSchema } = require("../../../shared/validators/userSchemas");

router.post("/register", validate(registerSchema), register);
router.post("/login",    validate(loginSchema),    login);
router.get("/me",        auth,                     me);
router.post("/logout",   auth,                     logout);

module.exports = router;
