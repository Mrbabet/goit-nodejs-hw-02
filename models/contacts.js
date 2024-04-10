const { Schema, models, model } = require("mongoose");
const Joi = require("joi");

const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-z]+)$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegex,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      match: phoneRegex,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  favorite: Joi.bool(),
});

const favouriteJoiSchema = Joi.object({
  favourite: Joi.bool().required(),
});

const Contact = models?.Contact || model("contacts", ContactSchema);

module.exports = { Contact, joiSchema, favouriteJoiSchema };
