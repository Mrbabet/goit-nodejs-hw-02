const express = require("express");
const ctrlAuth = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", ctrlAuth.register);

router.post("/login", ctrlAuth.login);

router.get("/current", authMiddleware, ctrlAuth.getCurrent);

router.post("/logout", authMiddleware, ctrlAuth.logout);
router.patch("/avatars", authMiddleware, upload.single("avatar"));

module.exports = router;
