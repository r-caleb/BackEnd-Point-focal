// scripts/initMinistries.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Ministry = require("../models/Ministry");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connecté à MongoDB");

    const ministries = [
      { name: "Primature", smallName:"Primature" },
      { name: "Postes, Télécommunications et Numériques", smallName:"PTN" },
      // Ajoutez d'autres ministères selon vos besoins
    ];

    for (const ministry of ministries) {
      const exists = await Ministry.findOne({ name: ministry.name });
      if (!exists) {
        await Ministry.create(ministry);
        console.log(`Ministère créé : ${ministry.name}`);
      } else {
        console.log(`Ministère déjà existant : ${ministry.name}`);
      }
    }

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB:", error);
  });
