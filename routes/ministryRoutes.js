// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerMinistry,
  getMinistries,
  getOneMinistry,
  modifyMinistry,
  deleteMinistry,
} = require("../controllers/ministryController");
const { protect } = require("../middleware/authMiddleware");

// Route d'enregistrement d'un ministère
router.post("/add-ministry", protect, registerMinistry);

router.get("/ministries", protect, getMinistries);
router.get("/one-ministry/:id", protect, getOneMinistry);
router.delete("/delete-ministry/:id", protect, deleteMinistry);
router.put("/edit-ministry/:id", protect, modifyMinistry);

module.exports = router;
