const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.campaigns.controller");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, controller.getAllCampaigns);
router.get("/:id", authenticateToken, controller.getCampaignById);
router.post("/", authenticateToken, controller.createCampaign);
router.put("/:id", authenticateToken, controller.updateCampaign);
router.delete("/:id", authenticateToken, controller.deleteCampaign);

module.exports = router;
