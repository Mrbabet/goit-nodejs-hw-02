const { Contact } = require("../models/contacts");
const {
  joiSchema,
  favouriteJoiSchema,
  contactIdSchema,
} = require("../validation/contactSchemas");
const get = async (req, res, next) => {
  try {
    const results = await Contact.find().exec();
    res.json({
      status: "success",
      code: 200,
      contacts: results,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const getById = async (req, res, next) => {
  try {
    const result = await Contact.findById(req.params.contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${req.params.contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const create = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.create(req.body);
    const { error } = joiSchema.validate(contactId);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const update = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favourite } = req.body;

  try {
    const { error: idError } = contactIdSchema.validate(req.params.contactId);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error } = favouriteJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Contact.findByIdAndUpdate(
      contactId,
      { favourite },
      { new: true }
    );
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const remove = async (req, res, next) => {
  try {
    const result = await Contact.findOneAndDelete(req.params.contactId);
    console.log(result);

    const { error } = contactIdSchema.validate(req.params.contactId);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    }
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${req.params.contactId}`,
      data: "Not Found",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
