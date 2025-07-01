const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserProfile,
  updateProfileByAdmin,
  changePassword,
  getUserStatistics,
  searchUsersByMinistry,
  updatePicture,
  getFirstAdmin,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/multerMemory");

// Route pour obtenir tous les utilisateurs (admin et cabinet)
router.get("/", protect, authorize(["admin", "cabinet"]), getAllUsers);
router.get("/admin", protect, getFirstAdmin);

// Route pour obtenir un utilisateur spécifique (admin ou le propriétaire)
router.get("/:id", protect, getUserById);

// Route pour mettre à jour un utilisateur (admin ou le propriétaire)
router.put("/edit-profile", protect, updateUserProfile);
router.put("/update-picture", protect, upload.single("picture"), updatePicture);

// Route pour mettre à jour un autre utilisateur (admin)
router.put(
  "/edit-profile/:id",
  protect,
  authorize("admin"),
  updateProfileByAdmin
);
router.put("/change-password", protect, changePassword);

// Route pour supprimer un utilisateur
router.delete("/delete", protect, authorize(["admin", "cabinet"]), deleteUser);

router.get("/stats/roles", protect, authorize("admin"), getUserStatistics);

/**
 * Route pour rechercher des utilisateurs par nom de ministère (admin seulement)
 */
router.get("/search", protect, authorize("admin"), searchUsersByMinistry);

module.exports = router;
