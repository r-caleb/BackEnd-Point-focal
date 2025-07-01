const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  smallName: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Ministere", userSchema);
