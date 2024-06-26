const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../validation/userSchemas");
const gravatar = require("gravatar");
const crypto = require("crypto");
const { sendVerification } = require("../utils/sendVerificationMail");
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
      verificationToken: crypto.randomBytes(64).toString("hex"),
    });
    await newUser.setPassword(value.password);
    await newUser.save();

    sendVerification(newUser);

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

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken)
      return res.status(404).json({ message: "User not found..." });

    const user = await User.findOne({ verificationToken });

    if (user) {
      user.verificationToken = null;
      user.verify = true;

      await user.save();
      res.status(200).json({
        user: {
          email: user.email,
          subscription: user.subscription,
          verificationToken: user.verificationToken,
          verify: user.verify,
        },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Error 401" });
  }

  if (user.verify) {
    return res
      .status(200)
      .json({ message: "Verification has already been passed" });
  }

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href="${process.env.CLIENT_URL}/api/users/verify/${user.verificationToken}">Click verify email<a>`,
  };
  sendVerification(user);
  res.json({
    status: "success",
    code: 200,
    email,
    message: "Verification email sent",
  });
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

module.exports = {
  getCurrent,
  login,
  register,
  logout,
  verifyEmail,
  resendVerifyEmail,
};
