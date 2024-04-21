const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../validation/userSchemas");
const gravatar = require("gravatar");

require("dotenv").config();

const register = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  const user = await User.findOne({ email: value.email });
  const avatarURL = gravatar.url(value.email);
  if (error) {
    return res.status(401).json({ message: error.message });
  }
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  try {
    const newUser = new User({
      email: value.email,
      subscription: "starter",
      avatarURL,
    });
    await newUser.setPassword(value.password);
    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        password: newUser.password,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    const user = await User.findOne({ email: value.email });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordCorrect = await user.validatePassword(value.password);

    if (isPasswordCorrect) {
      const payload = {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "12h",
      });
      user.token = token;
      await user.save();
      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrent = async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();
    res.status(201).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCurrent, login, register, logout };
