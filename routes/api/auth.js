const express = require("express");
const { validation, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrlAuth = require("../../controllers/authController");

const router = express.Router();

router.post("/signup", validation(schemas.registerSchema), ctrlAuth.register);

router.post("/login", validation(schemas.loginSchema), ctrlAuth.login);

router.get("/current", authenticate, ctrlAuth.getCurrent);

router.post("/logout", authenticate, ctrlAuth.logout);

module.exports = router;
