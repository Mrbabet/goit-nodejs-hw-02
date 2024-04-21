const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const { uploadAvatar } = require("../../controllers/avatarController");

const tmpDir = path.join(__dirname, "../../tmp");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.patch("/", upload.single("avatar"), uploadAvatar);

module.exports = router;
