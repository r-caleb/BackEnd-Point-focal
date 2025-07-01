const Ministere = require("../models/Ministry");

//Enregistrer un ministère
const registerMinistry = async (req, res) => {
  try {
    const { name, smallName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingMinistry = await Ministere.findOne({ name });
    if (existingMinistry) {
      return res.status(400).json({ message: "Ministère déjà enregistré" });
    }

    // Créer un nouveau ministère
    const newMinistry = new Ministere({
      name,
      smallName,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newMinistry.save();

    res.status(201).json({
      message: "Ministère créé avec succès",
      ministere: {
        name: newMinistry.name,
        smallName: newMinistry.smallName,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
};

//afficher tous les ministères
const getMinistries = async (req, res) => {
  try {
    const ministries = await Ministere.find();
    res.status(200).json(ministries);
  } catch (error) {
    console.error("Erreur d'affichage :", error);
    res.status(401).json({ error });
  }
};

//afficher un ministère
const getOneMinistry = async (req, res) => {
  try {
    const ministry = await Ministere.findOne({ _id: req.params.id });
    res.status(200).json(ministry);
  } catch (error) {
    console.error("Erreur d'affichage :", error);
    res.status(404).json({ error });
  }
};

//Modifier
const modifyMinistry = async (req, res) => {
  try {
    const ministry = await Ministere.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    );
    res.status(200).json({ message: "Ministère modifié !" });
  } catch (error) {
    console.error("Erreur d'affichage :", error);
    res.status(400).json({ error });
  }
};

//supprimer un ministère
const deleteMinistry = async (req, res) => {
  try {
    const ministry = await Ministere.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ministère supprimé" });
  } catch (error) {
    console.error("Erreur d'affichage :", error);
    res.status(400).json({ error });
  }
};

module.exports = {
  registerMinistry,
  getMinistries,
  getOneMinistry,
  modifyMinistry,
  deleteMinistry,
};
