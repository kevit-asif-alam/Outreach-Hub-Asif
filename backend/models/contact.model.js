const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  tags: [String],
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
