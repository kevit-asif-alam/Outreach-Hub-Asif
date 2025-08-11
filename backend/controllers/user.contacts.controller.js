const Contact = require("../models/contact.model");

exports.getAllContacts = async (req, res) => {
  const workspaceId = req.user.workspaceId; // from JWT middleware
  const contacts = await Contact.find({ workspaceId });
  res.json(contacts);
};

exports.getContactById = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const contact = await Contact.findOne({ _id: req.params.id, workspaceId });
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
};

exports.createContact = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const contact = await Contact.create({ ...req.body, workspaceId });
  res.status(201).json(contact);
};

exports.updateContact = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, workspaceId },
    req.body,
    { new: true }
  );
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, workspaceId });
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json({ message: "Contact deleted successfully" });
};
