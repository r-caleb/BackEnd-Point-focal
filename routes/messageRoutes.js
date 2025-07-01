const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMemory");
const messageController = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/send",
  protect,
  upload.array("files"),
  messageController.sendMessage
);
router.get("/:otherUserId", protect, messageController.getMessages);
router.get(
  "/received/grouped",
  protect,
  messageController.getReceivedMessagesGroupedBySender
);
router.delete("/:id", protect, messageController.deleteMessage);

module.exports = router;
