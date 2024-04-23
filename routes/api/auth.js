const express = require("express");
const ctrlAuth = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.get("/current", authMiddleware, ctrlAuth.getCurrent);
router.post("/logout", authMiddleware, ctrlAuth.logout);
router.get("/verify/:verificationToken", ctrlAuth.verifyEmail);
router.get("/verify");

module.exports = router;
