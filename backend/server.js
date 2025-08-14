const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/admin/auth", require("./routes/admin.auth.routes"));
app.use("/auth", require("./routes/user.auth.routes"));
app.use("/admin/contacts", require("./routes/admin.contacts.routes"));
app.use("/contacts", require("./routes/user.contacts.routes"));
app.use("/admin/workspaces", require("./routes/admin.workspaces.routes"));
app.use("/workspace", require("./routes/user.workspace.routes"));


// MongoDB connection
mongoose.connect("mongodb://localhost:27017/outreachhub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
