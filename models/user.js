const { Schema, model, models } = require("mongoose");
const Joi = require("joi");

const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-z]+)$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      mattch: emailRegex,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { virsionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const schemas = { registerSchema, loginSchema };

const User = models?.User || model("user", userSchema);

module.exports = {
  User,
  schemas,
};
