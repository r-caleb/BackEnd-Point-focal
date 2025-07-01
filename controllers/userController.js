// controllers/userController.js
const User = require("../models/User");
const Ministry = require("../models/Ministry");
const Message = require("../models/Message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadFileToS3 } = require("../middleware/aws");

/**
 * Afficher tous les utilisateurs
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }) // Exclure les admins
      .populate("ministry")
      .select("-password"); // Exclure le mot de passe

    res.status(200).json({ users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const getFirstAdmin = async (req, res) => {
  try {
    const firstAdmin = await User.findOne({ role: "admin" }) // Filtrer les admins
      .sort({ createdAt: 1 }) // Trier par date de création croissante (le plus ancien en premier)
      .select("-password"); // Ne pas retourner le mot de passe

    if (!firstAdmin) {
      return res.status(404).json({ message: "Aucun administrateur trouvé." });
    }

    res.status(200).json({ admin: firstAdmin });
  } catch (error) {
    console.error("Erreur lors de la récupération du premier admin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/**
 * Afficher un utilisateur spécifique par ID
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("ministry")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Modifier le profil de l'utilisateur connecté
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté
    const {
      email,
      firstname,
      lastname,
      middlename,
      gender,
      fonction,
      administration,
      address,
      phoneNumber,
      domain,
    } = req.body;
    const user = await User.findById(userId).populate("ministry");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Mettre à jour les champs si fournis
    if (email && email !== user.email) {
      // Vérifier si l'email est déjà utilisé
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
      user.email = email;
    }
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (middlename) user.middlename = middlename;
    if (gender) user.gender = gender;
    if (fonction) user.fonction = fonction;
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (administration) user.administration = administration;
    if (domain) user.domain = domain;
    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      gender: user.gender,
      fonction: user.fonction,
      administration: user.administration,
      address: user.address,
      phoneNumber: user.phoneNumber,
      ministry: {
        smallName: user.ministry.smallName,
        name: user.ministry.name,
      },
      domain: user.domain,
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//Admin Edit
const updateProfileByAdmin = async (req, res) => {
  try {
    const userId = req.params.id; // ID de l'utilisateur à editer
    const {
      email,
      firstname,
      lastname,
      middlename,
      gender,
      fonction,
      administration,
      address,
      phoneNumber,
      role,
      ministryName,
    } = req.body;
    const user = await User.findById(userId).populate("ministry");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Mettre à jour les champs si fournis
    if (email && email !== user.email) {
      // Vérifier si l'email est déjà utilisé
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
      user.email = email;
    }
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (middlename) user.middlename = middlename;
    if (gender) user.gender = gender;
    if (fonction) user.fonction = fonction;
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (administration) user.administration = administration;
    if (role) user.role = role;

    if (ministryName && ministryName !== user.ministry.smallName) {
      // Trouver le ministère
      let ministry = await Ministry.findOne({ smallName: ministryName });
      if (!ministry) {
        res.status(404).json({
          message: "Ministère non trouvé",
        });
      }
      user.ministry = ministry._id;
    }

    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      gender: user.gender,
      fonction: user.fonction,
      administration: user.administration,
      address: user.address,
      phoneNumber: user.phoneNumber,
      role: user.role,
      ministry: ministryName,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Supprimer un utilisateur par ID
 */
/* const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.remove();

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
 */
const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.body; // ✅

    if (!userId) {
      return res
        .status(400)
        .json({ message: "ID utilisateur manquant dans la requête." });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Supprimer tous les messages où il est soit expéditeur soit destinataire
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'utilisateur :",
      error.message
    );
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'utilisateur.",
    });
  }
};

/**
 * Changer le mot de passe de l'utilisateur connecté
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Vérifier que tous les champs sont fournis
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    // Vérifier que le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Les nouveaux mots de passe ne correspondent pas" });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Afficher toutes les statistiques des utilisateurs par rôle
 */
const getUserStatistics = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1,
        },
      },
    ]);

    // Initialiser les rôles avec zéro si aucun utilisateur n'existe pour un rôle donné
    const roles = ["admin", "cabinet", "secretariat"];
    const formattedStats = roles.map((role) => {
      const stat = stats.find((s) => s.role === role);
      return {
        role,
        count: stat ? stat.count : 0,
      };
    });

    res.status(200).json({ statistics: formattedStats });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques des utilisateurs:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Rechercher des utilisateurs par le nom de leur ministère
 */
const searchUsersByMinistry = async (req, res) => {
  try {
    const { ministry } = req.query;

    if (!ministry) {
      return res
        .status(400)
        .json({ message: "Le nom du ministère est requis pour la recherche." });
    }

    // Trouver le ministère correspondant au nom fourni (cas insensible)
    const ministryDoc = await Ministry.findOne({
      smallName: { $regex: ministry, $options: "i" },
    });

    if (!ministryDoc) {
      return res
        .status(404)
        .json({ message: "Aucun ministère trouvé avec ce nom." });
    }

    // Trouver les utilisateurs associés à ce ministère
    const users = await User.find({ ministry: ministryDoc._id })
      .populate("ministry", "smallName") // Inclure le nom du ministère
      .select("-password"); // Exclure le mot de passe

    res.status(200).json({ users });
  } catch (error) {
    console.error(
      "Erreur lors de la recherche des utilisateurs par ministère:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};
//changer photo de profil

const updatePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier n'a été uploadé." });
    }

    const file = req.file;
    const fileName = `profile-${Date.now()}-${file.originalname}`;

    // Upload vers S3
    const result = await uploadFileToS3(file.buffer, fileName, file.mimetype);

    // Enregistre l'URL S3 dans MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture: result.Location },
      { new: true }
    );

    res.status(200).json({
      message: "Image de profil mise à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'image de profil" });
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateProfileByAdmin,
  deleteUser,
  changePassword,
  getUserStatistics,
  searchUsersByMinistry,
  updatePicture,
  getFirstAdmin
};
