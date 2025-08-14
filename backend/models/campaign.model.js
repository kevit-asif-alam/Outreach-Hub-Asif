const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
  status: { type: String, enum: ["Draft", "Running", "Completed"], default: "Draft" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Campaign", campaignSchema);
