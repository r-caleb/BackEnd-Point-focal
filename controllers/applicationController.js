const Application = require("../models/Application");
const Ministry = require("../models/Ministry");

// Ajouter une application
// Ajouter une application
exports.addApplication = async (req, res) => {
  try {
    const applicationData = req.body;

    // Recherche du ministère par smallName
    const ministry = await Ministry.findOne({
      smallName: applicationData.ministry,
    });
    if (!ministry) {
      return res.status(404).json({ message: "Ministère non trouvé" });
    }

    // Remplace le smallName par l'ID du ministère
    applicationData.ministry = ministry._id;

    // Création et sauvegarde de l'application
    const newApplication = new Application(applicationData);
    await newApplication.save();

    res.status(201).json({
      message: "Application ajoutée avec succès",
      application: newApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'application",
      error: error.message,
    });
  }
};

// Liste des applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("ministry") // Inclut le nom du ministère
      .populate("createdBy", "firstname lastname middlename")
      .sort({ createdAt: -1 }); // Trier par date de création

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des applications",
      error: error.message,
    });
  }
};

// Modifier une application
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Si un ministrySmallName est fourni, rechercher l'ID correspondant
    if (updates.ministrySmallName) {
      const ministry = await Ministry.findOne({
        smallName: updates.ministrySmallName,
      });
      if (!ministry) {
        return res.status(404).json({ message: "Ministère non trouvé" });
      }

      updates.ministry = ministry._id; // Remplace le smallName par l'ID du ministère
      delete updates.ministrySmallName; // Supprime le smallName du payload
    }

    // Mettre à jour l'application
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application non trouvée" });
    }

    res.status(200).json({
      message: "Application modifiée avec succès",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification de l'application",
      error: error.message,
    });
  }
};

// Supprimer une application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer l'application
    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application non trouvée" });
    }

    res.status(200).json({ message: "Application supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'application",
      error: error.message,
    });
  }
};
