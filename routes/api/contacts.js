const express = require("express");
const { validation, isValidId } = require("../../middlewares");
const { joiSchema, favoriteJoiSchema } = require("../../models");
const ctrlContacts = require("../../controllers");

const router = express.Router();

router.get("/", ctrlContacts.get);
router.get("/:contactId", isValidId, ctrlContacts.getById);
router.post("/", validation(joiSchema), ctrlContacts.create);
router.delete("/:contactId", isValidId, ctrlContacts.remove);
router.put(
  "/:contactId",
  isValidId,
  validation(joiSchema),
  ctrlContacts.update
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validation(favoriteJoiSchema),
  ctrlContacts.updateStatus
);

module.exports = router;
