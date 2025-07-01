// controllers/authController.js
const User = require("../models/User");
const Ministry = require("../models/Ministry");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "5h" } // Le token expirera dans 5 heure
  );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }
    // Vérifier si le ministère existe
    const ministryExists = await Ministry.findOne({
      smallName: req.body.ministry,
    });
    if (!ministryExists) {
      return res.status(400).json({ message: "Ministère non trouvé" });
    }
    // Vérifier que le mot de passe est présent
    if (!req.body.password) {
      return res.status(400).json({ message: "Mot de passe manquant" });
    }

    // Hacher le mot de passe
    const saltRounds = 10; // Définir le nombre de tours pour le salage
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Créer un nouvel utilisateur
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      ministry: ministryExists._id,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Générer un token JWT
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstname: newUser.firstname,
        middlename: newUser.middlename,
        lastname: newUser.lastname,
        gender: newUser.gender,
        fonction: newUser.fonction,
        administration: newUser.administration,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        role: newUser.role,
        domain: newUser.domain,
        ministry: ministryExists.smallName,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
};

// Connexion d'un utilisateur existant
const login = async (req, res) => {
  try {
    const { username, password } = req.body; // 'identifier' peut être email ou nom du ministère

    let user;

    // Vérifier si l'identifiant est un email
    const emailRegex = /.+@.+\..+/;
    if (emailRegex.test(username)) {
      user = await User.findOne({ email: username }).populate("ministry");
    } else {
      // Recherche par lastname
      user = await User.findOne({ lastname: username }).populate("ministry");
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Connexion réussie",
      token,
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      fonction: user.fonction,
      administration: user.administration,
      address: user.address,
      role: user.role,
      picture: user.picture,
      ministry: {
        smallName: user.ministry.smallName,
        name: user.ministry.name,
      },
      domain: user.domain,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir les informations de l'utilisateur connecté
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclure le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
