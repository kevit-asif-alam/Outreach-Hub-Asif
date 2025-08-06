// ============================================================================
// ANALYTICS QUERIES FOR DASHBOARD
// ============================================================================

// 1. Number of campaigns done per day (filterable by date range)
db.campaigns.aggregate([
  {
    $match: {
      workspace_id: ObjectId("workspace_id"),
      status: "completed",
      completed_at: {
        $gte: new Date("2024-01-01"),
        $lte: new Date("2024-12-31")
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$completed_at" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);

// 2. Number of campaign messages sent per message type per day
db.campaign_messages.aggregate([
  {
    $match: {
      workspace_id: ObjectId("workspace_id"),
      status: { $in: ["sent", "delivered"] },
      sent_at: {
        $gte: new Date("2024-01-01"),
        $lte: new Date("2024-12-31")
      }
    }
  },
  {
    $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$sent_at" } },
        message_type: "$message_snapshot.template_type"
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.date": 1, "_id.message_type": 1 } }
]);

// 3. Number of contacts reached per day
db.campaign_messages.aggregate([
  {
    $match: {
      workspace_id: ObjectId("workspace_id"),
      status: { $in: ["sent", "delivered"] },
      sent_at: {
        $gte: new Date("2024-01-01"),
        $lte: new Date("2024-12-31")
      }
    }
  },
  {
    $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$sent_at" } },
        contact_id: "$contact_id"
      }
    }
  },
  {
    $group: {
      _id: "$_id.date",
      unique_contacts: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);

// 4. List of recent 5 campaigns with targeted contact tags
db.campaigns.find({
  workspace_id: ObjectId("workspace_id"),
  is_active: true
})
.sort({ created_at: -1 })
.limit(5)
.project({
  name: 1,
  target_tags: 1,
  status: 1,
  created_at: 1,
  "stats.total_contacts": 1
});

// 5. List of top 5 tags with highest number of contacts
db.contacts.aggregate([
  {
    $match: {
      workspace_id: ObjectId("workspace_id"),
      is_active: true
    }
  },
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      contact_count: { $sum: 1 }
    }
  },
  { $sort: { contact_count: -1 } },
  { $limit: 5 }
]);
