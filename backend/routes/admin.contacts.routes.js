const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.contacts.controller");

router.get("/", controller.getAllContacts);
router.get("/:id", controller.getContactById);
router.delete("/:id", controller.deleteContact);

module.exports = router;
