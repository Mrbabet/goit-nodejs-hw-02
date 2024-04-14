const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email()
    .pattern(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-z]+)$/)
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  favorite: Joi.bool(),
});

const favouriteJoiSchema = Joi.object({
  favourite: Joi.bool().required(),
});

const contactIdSchema = Joi.string().required();

module.exports = { joiSchema, favouriteJoiSchema, contactIdSchema };
