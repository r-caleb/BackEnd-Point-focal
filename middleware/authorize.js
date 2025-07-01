
const authorize = (roles = []) => {
  // roles peut être une chaîne unique ou un tableau de rôles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Non autorisé, utilisateur non authentifié" });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Accès refusé, rôle insuffisant" });
      }

      next();
    },
  ];
};

module.exports = authorize;
