const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, role: "admin" });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ access_token: token });
};
