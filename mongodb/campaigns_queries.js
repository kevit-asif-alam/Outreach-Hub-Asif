// 3. MESSAGE TEMPLATES MANAGEMENT
// -------------------------------

// List message templates with pagination
db.message_templates.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true
})
.sort({ created_at: -1 })
.skip(0)
.limit(10);

// List templates by type
db.message_templates.find({
  workspace_id: ObjectId("workspace_id"),
  type: "Text & Image",
  is_active: true
})
.sort({ name: 1 });

// Create message template
db.message_templates.insertOne({
  workspace_id: ObjectId("workspace_id"),
  name: "Welcome Message",
  type: "Text",
  content: {
    text: "Welcome to our service! We're excited to have you.",
    image_url: null,
    image_alt: null
  },
  created_by: ObjectId("user_id"),
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
});

// Create image template
db.message_templates.insertOne({
  workspace_id: ObjectId("workspace_id"),
  name: "Product Showcase",
  type: "Text & Image",
  content: {
    text: "Check out our latest product!",
    image_url: "https://example.com/product.jpg",
    image_alt: "Latest product showcase"
  },
  created_by: ObjectId("user_id"),
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
});

// View template details
db.message_templates.findOne({
  _id: ObjectId("template_id"),
  workspace_id: ObjectId("workspace_id"),
  is_active: true
});

// Update template
db.message_templates.updateOne(
  { 
    _id: ObjectId("template_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      name: "Updated Template Name",
      "content.text": "Updated message content",
      updated_at: new Date()
    }
  }
);

// Delete template (soft delete)
db.message_templates.updateOne(
  { 
    _id: ObjectId("template_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      is_active: false,
      updated_at: new Date()
    }
  }
);

// 4. CAMPAIGNS MANAGEMENT
// -----------------------

// List campaigns with pagination
db.campaigns.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true
})
.sort({ created_at: -1 })
.skip(0)
.limit(10);

// List campaigns by status
db.campaigns.find({
  workspace_id: ObjectId("workspace_id"),
  status: "draft",
  is_active: true
})
.sort({ created_at: -1 });

// Create campaign
db.campaigns.insertOne({
  workspace_id: ObjectId("workspace_id"),
  name: "Q1 Product Launch",
  description: "Campaign for new product launch",
  status: "draft",
  target_tags: ["lead", "prospect"],
  message_template_id: ObjectId("template_id"),
  config: {
    scheduled_at: null,
    priority: "high"
  },
  stats: {
    total_contacts: 0,
    messages_sent: 0,
    messages_delivered: 0,
    messages_failed: 0
  },
  created_by: ObjectId("user_id"),
  created_at: new Date(),
  updated_at: new Date(),
  launched_at: null,
  completed_at: null,
  is_active: true
});

// View campaign details
db.campaigns.findOne({
  _id: ObjectId("campaign_id"),
  workspace_id: ObjectId("workspace_id"),
  is_active: true
});

// Update campaign (only if status is draft)
db.campaigns.updateOne(
  { 
    _id: ObjectId("campaign_id"),
    workspace_id: ObjectId("workspace_id"),
    status: "draft"
  },
  {
    $set: {
      name: "Updated Campaign Name",
      target_tags: ["vip", "customer"],
      updated_at: new Date()
    }
  }
);

// Launch campaign
db.campaigns.updateOne(
  { 
    _id: ObjectId("campaign_id"),
    workspace_id: ObjectId("workspace_id"),
    status: "draft"
  },
  {
    $set: {
      status: "running",
      launched_at: new Date(),
      updated_at: new Date()
    }
  }
);

// Complete campaign
db.campaigns.updateOne(
  { 
    _id: ObjectId("campaign_id"),
    workspace_id: ObjectId("workspace_id"),
    status: "running"
  },
  {
    $set: {
      status: "completed",
      completed_at: new Date(),
      updated_at: new Date()
    }
  }
);

// Copy campaign
db.campaigns.aggregate([
  { $match: { _id: ObjectId("campaign_id"), workspace_id: ObjectId("workspace_id") } },
  { $addFields: { 
      _id: new ObjectId(),
      name: { $concat: ["$name", " (Copy)"] },
      status: "draft",
      launched_at: null,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      stats: {
        total_contacts: 0,
        messages_sent: 0,
        messages_delivered: 0,
        messages_failed: 0
      }
    }
  },
  { $out: "campaigns" }
]);

// Delete campaign (soft delete)
db.campaigns.updateOne(
  { 
    _id: ObjectId("campaign_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      is_active: false,
      updated_at: new Date()
    }
  }
);

// 5. CAMPAIGN MESSAGES MANAGEMENT
// -------------------------------

// Get contacts for campaign launch
db.contacts.find({
  workspace_id: ObjectId("workspace_id"),
  tags: { $in: ["lead", "prospect"] }, // target_tags from campaign
  is_active: true
});

// Create campaign messages (bulk insert during launch)
db.campaign_messages.insertMany([
  {
    workspace_id: ObjectId("workspace_id"),
    campaign_id: ObjectId("campaign_id"),
    contact_id: ObjectId("contact_id_1"),
    contact_snapshot: {
      phone_number: "+1234567890",
      name: "John Doe",
      email: "john@example.com",
      tags: ["lead", "tech"]
    },
    message_snapshot: {
      template_name: "Welcome Message",
      template_type: "Text",
      content: {
        text: "Welcome to our service!",
        image_url: null,
        image_alt: null
      }
    },
    status: "pending",
    sent_at: null,
    delivered_at: null,
    error_message: null,
    created_at: new Date(),
    updated_at: new Date()
  }
  // ... more messages
]);

// Update message status to sent
db.campaign_messages.updateOne(
  { 
    _id: ObjectId("message_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      status: "sent",
      sent_at: new Date(),
      updated_at: new Date()
    }
  }
);

// Update message status to delivered
db.campaign_messages.updateOne(
  { 
    _id: ObjectId("message_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      status: "delivered",
      delivered_at: new Date(),
      updated_at: new Date()
    }
  }
);

// Update message status to failed
db.campaign_messages.updateOne(
  { 
    _id: ObjectId("message_id"),
    workspace_id: ObjectId("workspace_id")
  },
  {
    $set: {
      status: "failed",
      error_message: "Phone number invalid",
      updated_at: new Date()
    }
  }
);

// Get campaign messages with pagination
db.campaign_messages.find({
  workspace_id: ObjectId("workspace_id"),
  campaign_id: ObjectId("campaign_id")
})
.sort({ created_at: -1 })
.skip(0)
.limit(50);