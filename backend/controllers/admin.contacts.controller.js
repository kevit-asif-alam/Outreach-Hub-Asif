const Contact = require("../models/contact.model");

exports.getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

exports.getContactById = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json({ message: "Contact deleted successfully" });
};
