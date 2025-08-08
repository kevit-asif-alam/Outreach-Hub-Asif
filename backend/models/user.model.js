const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed
  role: { type: String, enum: ["admin", "editor", "viewer"] },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: false },
});

module.exports = mongoose.model("User", userSchema);
