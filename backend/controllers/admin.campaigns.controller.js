const Campaign = require("../models/campaign.model");

exports.getAllCampaigns = async (req, res) => {
  const campaigns = await Campaign.find()
    .populate("workspaceId", "name")
    .populate("templateId", "name")
    .populate("contacts", "name email");
  res.json(campaigns);
};

exports.getCampaignById = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("workspaceId", "name")
    .populate("templateId", "name")
    .populate("contacts", "name email");
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json(campaign);
};

exports.deleteCampaign = async (req, res) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json({ message: "Campaign deleted successfully" });
};
