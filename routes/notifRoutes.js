const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  deleteNotification,
  countUnread,
} = require("../controllers/notificationsController");

router.get("/:userId", getUserNotifications);
router.patch("/read/:id", markAsRead);
router.delete("/:id", deleteNotification);
router.get("/unread/count/:userId", countUnread);

module.exports = router;
