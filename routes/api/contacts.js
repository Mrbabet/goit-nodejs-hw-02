const express = require("express");
const ctrlContacts = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", ctrlContacts.get);
router.get("/:contactId", ctrlContacts.getById);
router.post("/", ctrlContacts.create);
router.delete("/:contactId", ctrlContacts.remove);
router.put("/:contactId", ctrlContacts.update);
router.patch("/:contactId/favourite", ctrlContacts.updateStatus);

module.exports = router;
