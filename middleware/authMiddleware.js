// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obtenir le token depuis le header
      token = req.headers.authorization.split(" ")[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtenir l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Erreur dans le middleware protect:", error);
      res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Non autorisé, aucun token" });
  }
};

module.exports = { protect };
