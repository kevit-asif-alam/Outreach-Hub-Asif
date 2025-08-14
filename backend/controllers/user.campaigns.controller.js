const Campaign = require("../models/campaign.model");

exports.getAllCampaigns = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const campaigns = await Campaign.find({ workspaceId })
    .populate("templateId", "name")
    .populate("contacts", "name email");
  res.json(campaigns);
};

exports.getCampaignById = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const campaign = await Campaign.findOne({ _id: req.params.id, workspaceId })
    .populate("templateId", "name")
    .populate("contacts", "name email");
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json(campaign);
};

exports.createCampaign = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const campaign = await Campaign.create({ ...req.body, workspaceId });
  res.status(201).json(campaign);
};

exports.updateCampaign = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, workspaceId },
    req.body,
    { new: true }
  );
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json(campaign);
};

exports.deleteCampaign = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, workspaceId });
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  res.json({ message: "Campaign deleted successfully" });
};
