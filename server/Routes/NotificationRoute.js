const express = require("express");
const {
  createNotification,
  getNotificationByUserId,
  addNotificationByUserId,
} = require("../Controllers/NotificationController");

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getNotificationByUserId);
router.post("/:userId", addNotificationByUserId);

module.exports = router;
