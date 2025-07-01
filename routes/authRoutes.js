// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Route d'inscription
router.post("/register", register);

// Route de connexion
router.post("/login", login);

// Route pour obtenir les informations de l'utilisateur connecté
router.get("/me", protect, getMe);

module.exports = router;
