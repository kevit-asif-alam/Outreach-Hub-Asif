const jwt = require("jsonwebtoken");
const SECRET = "supersecret"; // Move to env in real project

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, workspaceId: user.workspaceId || null },
    SECRET,
    { expiresIn: "7d" }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
