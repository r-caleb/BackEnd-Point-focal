const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");



// Route pour ajouter une application
router.post("/", protect, applicationController.addApplication);

// Route pour obtenir la liste des applications
router.get("/", protect, applicationController.getApplications);

// Route pour modifier une application
router.put("/:id", protect, applicationController.updateApplication);

// Route pour supprimer une application
router.delete("/:id", protect, applicationController.deleteApplication);

module.exports = router;
