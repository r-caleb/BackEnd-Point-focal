const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  seen: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
