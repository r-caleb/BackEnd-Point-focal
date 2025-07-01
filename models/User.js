const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
    },
    lastname: {
      type: String,
      required: false,
      trim: true,
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
    },
    middlename: {
      type: String,
      required: false,
      trim: true,
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
    },
    gender: { type: String, enum: ["Homme", "Femme"], required: false },
    fonction: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "cabinet", "secretariat"],
      required: true,
    },
    administration: { type: String, required: false },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    email: {
      type: String,
      required: false,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Veuillez fournir une adresse e-mail valide"],
    },
    domain: { type: String, required: false },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    picture: {
      type: String,
      required: false,
      default: "", // Valeur par défaut si aucune image n'est fournie
      /* match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
        "Veuillez fournir une URL d'image valide",
      ], */
    },
    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministere",
      required: [true, "Le ministère est requis"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
