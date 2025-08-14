const Workspace = require("../models/workspace.model");

exports.getAllWorkspaces = async (req, res) => {
  const workspaces = await Workspace.find();
  res.json(workspaces);
};

exports.getWorkspaceById = async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace);
};

exports.createWorkspace = async (req, res) => {
  const workspace = await Workspace.create(req.body);
  res.status(201).json(workspace);
};

exports.updateWorkspace = async (req, res) => {
  const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace);
};

exports.deleteWorkspace = async (req, res) => {
  const workspace = await Workspace.findByIdAndDelete(req.params.id);
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json({ message: "Workspace deleted successfully" });
};
