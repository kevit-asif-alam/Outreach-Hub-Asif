const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.contacts.controller");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, controller.getAllContacts);
router.get("/:id", authenticateToken, controller.getContactById);
router.post("/", authenticateToken, controller.createContact);
router.put("/:id", authenticateToken, controller.updateContact);
router.delete("/:id", authenticateToken, controller.deleteContact);

module.exports = router;
