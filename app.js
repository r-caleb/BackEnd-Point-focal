// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const minRoutes = require("./routes/ministryRoutes");
const messageRoutes = require("./routes/messageRoutes");
const appRoutes = require("./routes/appRoutes");
const notifRoutes = require("./routes/notifRoutes");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // augmente le délai
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(express.json());

// Routes
/* app.use("/api/auth", authRoutes); */
// Middleware pour servir les fichiers statiques (images de profil)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Backend Point Focal");
});
app.use("/auth", authRoutes);
app.use("/", minRoutes);
app.use("/users", userRoutes);
app.use("/message", messageRoutes);
app.use("/apps", appRoutes);
app.use("/notifs", notifRoutes);

module.exports = app;
