const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema(
  {
    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministere",
      required: [true, "Le ministère est requis"],
    },
    type: {
      type: String,
      enum: ["Application web", "Application mobile", "Application de bureau"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    registry: {
      type: String,
      required: false,
    },
    developmentService: {
      type: String,
      enum: ["Interne", "Prestataire externe"],
      required: true,
    },
    financingSource: {
      type: String,
      enum: ["Budget interne", "Partenaire", "Subvention"],
      required: true,
    },
    partnerName: {
      type: String,
      required: function () {
        return this.financingSource === "Partenaire";
      }, // Obligatoire si la source de financement est un partenaire
      trim: true,
    },
    usageContext: {
      type: String,
      enum: ["Public", "Cabinet", "Secretariat"],
      required: true,
    },
    maintenanceService: {
      type: String,
      enum: ["Interne", "Prestataire externe"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
