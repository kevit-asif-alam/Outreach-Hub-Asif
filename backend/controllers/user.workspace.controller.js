const Workspace = require("../models/workspace.model");

exports.getMyWorkspace = async (req, res) => {
  const workspace = await Workspace.findById(req.user.workspaceId);
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace);
};

exports.updateMyWorkspace = async (req, res) => {
  const workspace = await Workspace.findByIdAndUpdate(req.user.workspaceId, req.body, { new: true });
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace);
};
