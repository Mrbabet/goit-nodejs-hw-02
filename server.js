const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
require("dotenv").config();
const JwtStrategy = require("./config/jwt.js");
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const contactsRouter = require("./routes/api/contacts.js");
const authRouter = require("./routes/api/auth.js");
const avatarRouter = require("./routes/api/avatars");
const authMiddleware = require("./middlewares/authenticate.js");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(JwtStrategy);

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);
app.use("/avatars", authMiddleware, avatarRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
