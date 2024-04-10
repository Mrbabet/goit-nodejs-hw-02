const { User } = require("../models/user");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = process.env;

const getCurrent = async (req, res) => {
  console.log(req.user);
  const { email, name } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      email,
      name,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const pasCompare = bcrypt.compareSync(password, user.password);

  if (!user || !pasCompare) {
    throw new Unauthorized("Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email,
      },
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    status: "success",
    code: 204,
    message: "No Content",
  });
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} in use`);
  }

  const hashPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    },
  });
};
module.exports = { getCurrent, login, register, logout };
