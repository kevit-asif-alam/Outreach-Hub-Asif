// 3. WORKSPACE USERS MANAGEMENT
// -----------------------------

// List workspace users with pagination
db.workspace_users.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true
})
.sort({ created_at: -1 })
.skip(0)
.limit(10);

// Create workspace user
db.workspace_users.insertOne({
  workspace_id: ObjectId("workspace_id"),
  email: "user@example.com",
  password: "$2b$10$hashedpassword",
  name: "John Doe",
  role: "Editor", // or "Viewer"
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true,
  last_login: null
});

// View workspace user details
db.workspace_users.findOne({
  _id: ObjectId("user_id"),
  workspace_id: ObjectId("workspace_id"),
  is_active: true
});

// Update workspace user
db.workspace_users.updateOne(
  { 
    _id: ObjectId("user_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      name: "Updated Name",
      role: "Viewer",
      updated_at: new Date()
    }
  }
);

// Delete workspace user (soft delete)
db.workspace_users.updateOne(
  { 
    _id: ObjectId("user_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      is_active: false,
      updated_at: new Date()
    }
  }
);