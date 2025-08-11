// seed.js (run once with: node seed.js)
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/outreachhub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await User.deleteMany({});
  await User.insertMany([
    {
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    },
    {
      username: "editor",
      password: await bcrypt.hash("editor123", 10),
      role: "editor"
    },
    {
      username: "viewer",
      password: await bcrypt.hash("viewer123", 10),
      role: "viewer"
    }
  ]);
  console.log("Seeded users");
  mongoose.disconnect();
});
