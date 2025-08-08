// ============================================================================
// OUTREACHHUB PORTAL QUERIES
// ============================================================================

// 1. WORKSPACE USER AUTHENTICATION
// ---------------------------------

// Login - Find workspace user by email and workspace
db.workspace_users.findOne({
  email: "user@example.com",
  workspace_id: ObjectId("workspace_id"),
  is_active: true
});

// Update last login
db.workspace_users.updateOne(
  { 
    _id: ObjectId("user_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      last_login: new Date(),
      updated_at: new Date()
    }
  }
);

// 2. CONTACTS MANAGEMENT
// ----------------------

// List contacts with pagination and search
db.contacts.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true,
  $or: [
    { name: { $regex: "search_term", $options: "i" } },
    { phone_number: { $regex: "search_term", $options: "i" } },
    { email: { $regex: "search_term", $options: "i" } }
  ]
})
.sort({ created_at: -1 })
.skip(0)
.limit(10);

// List contacts by tags
db.contacts.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true,
  tags: { $in: ["vip", "lead"] }
})
.sort({ name: 1 });

// Create contact
db.contacts.insertOne({
  workspace_id: ObjectId("workspace_id"),
  phone_number: "+1234567890",
  name: "Jane Smith",
  email: "jane@example.com",
  tags: ["lead", "tech"],
  additional_info: {
    company: "Tech Corp",
    position: "CTO",
    notes: "Interested in our product"
  },
  created_by: ObjectId("user_id"),
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
});

// View contact details
db.contacts.findOne({
  _id: ObjectId("contact_id"),
  workspace_id: ObjectId("workspace_id"),
  is_active: true
});

// Update contact
db.contacts.updateOne(
  { 
    _id: ObjectId("contact_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      name: "Updated Name",
      email: "newemail@example.com",
      tags: ["vip", "customer"],
      updated_at: new Date()
    }
  }
);

// Delete contact (soft delete)
db.contacts.updateOne(
  { 
    _id: ObjectId("contact_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      is_active: false,
      updated_at: new Date()
    }
  }
);