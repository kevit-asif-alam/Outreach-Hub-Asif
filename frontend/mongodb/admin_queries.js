// 1. ADMIN AUTHENTICATION
// ------------------------

// Login - Find admin user by email
db.admin_users.findOne({
  email: "admin@example.com",
  is_active: true
});

// Create admin user
db.admin_users.insertOne({
  email: "admin@example.com",
  password: "$2b$10$hashedpassword", // bcrypt hashed
  name: "Admin User",
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
});

// 2. WORKSPACES MANAGEMENT
// ------------------------

// List all workspaces with pagination
db.workspaces.find({
  is_active: true
})
.sort({ created_at: -1 })
.skip(0)
.limit(10);

// Create workspace
db.workspaces.insertOne({
  name: "Acme Corp",
  description: "Marketing workspace for Acme Corporation",
  created_by: ObjectId("admin_user_id"),
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true,
  settings: {
    timezone: "UTC",
    currency: "USD"
  }
});

// View workspace details
db.workspaces.findOne({
  _id: ObjectId("workspace_id"),
  is_active: true
});

// Update workspace
db.workspaces.updateOne(
  { _id: ObjectId("workspace_id") },
  {
    $set: {
      name: "Updated Workspace Name",
      description: "Updated description",
      updated_at: new Date()
    }
  }
);

// Delete workspace (soft delete)
db.workspaces.updateOne(
  { _id: ObjectId("workspace_id") },
  {
    $set: {
      is_active: false,
      updated_at: new Date()
    }
  }
);

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