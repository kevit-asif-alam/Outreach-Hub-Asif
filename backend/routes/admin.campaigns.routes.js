const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.campaigns.controller");

router.get("/", controller.getAllCampaigns);
router.get("/:id", controller.getCampaignById);
router.delete("/:id", controller.deleteCampaign);

module.exports = router;
