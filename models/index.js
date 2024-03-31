const { Contact } = require("../models/contact");

const getAll = async () => {
  return Contact.find({});
};

const getContactById = (id) => {
  return Contact.findById({ _id: id });
};

const add = (username, email, phone) => {
  return Contact.create({ username, email, phone });
};

const removeById = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateById = (id) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    {
      new: true,
    }
  );
};

const updateFavorite = (id) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { favorite },
    {
      new: true,
    }
  );
};

module.exports = {
  getAll,
  getContactById,
  add,
  removeById,
  updateById,
  updateFavorite,
};
