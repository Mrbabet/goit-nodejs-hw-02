const express = require("express");
const ctrlAuth = require("../../controllers/authController");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/signup", ctrlAuth.register);

router.post("/login", ctrlAuth.login);

router.get("/current", authenticate, ctrlAuth.getCurrent);

router.post("/logout", authenticate, ctrlAuth.logout);
router.patch("/avatars", authenticate, upload.single("avatar"));

module.exports = router;
