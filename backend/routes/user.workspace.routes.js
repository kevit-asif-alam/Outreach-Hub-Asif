const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.workspace.controller");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, controller.getMyWorkspace);
router.put("/", authenticateToken, controller.updateMyWorkspace);

module.exports = router;
