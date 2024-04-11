const express = require("express");
const ctrlAuth = require("../../controllers/authController");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/signup", ctrlAuth.register);

router.post("/login", ctrlAuth.login);

router.get("/current", authenticate, ctrlAuth.getCurrent);

router.post("/logout", authenticate, ctrlAuth.logout);

module.exports = router;
