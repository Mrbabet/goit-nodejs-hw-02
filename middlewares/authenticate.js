const { User } = require("../models/user");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(Unauthorized(401, "Authorization header not found"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(Unauthorized(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(Unauthorized(401, "user not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(Unauthorized(401, error.message));
  }
};

module.exports = authenticate;
