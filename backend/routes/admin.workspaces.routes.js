const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.workspaces.controller");

router.get("/", controller.getAllWorkspaces);
router.get("/:id", controller.getWorkspaceById);
router.post("/", controller.createWorkspace);
router.put("/:id", controller.updateWorkspace);
router.delete("/:id", controller.deleteWorkspace);

module.exports = router;
