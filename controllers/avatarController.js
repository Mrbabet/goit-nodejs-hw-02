const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const { User } = require("../models/user");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarFile = req.file;

    if (!avatarFile) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const jimpImage = await Jimp.read(avatarFile.path);

    await jimpImage
      .resize(250, 250)
      .writeAsync(path.join(avatarDir, avatarFile.filename));

    const fileName = `${userId}-${Date.now()}${path.extname(
      avatarFile.originalname
    )}`;

    fs.renameSync(
      path.join(avatarDir, avatarFile.filename),
      path.join(avatarDir, fileName)
    );

    const user = await User.findById(userId);
    user.avatarURL = `/avatars/${fileName}`;
    await user.save();

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { uploadAvatar };
