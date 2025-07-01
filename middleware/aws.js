const AWS = require("aws-sdk");

// Configuration des identifiants AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Fonction pour télécharger un fichier vers S3
const uploadFileToS3 = (fileBuffer, fileName, mimeType) => {
  let folder = "uploads/images"; // par défaut pour les images

  // Si ce n'est pas une image, on stocke dans "uploads/files"
  if (!mimeType.startsWith("image/")) {
    folder = "uploads/files";
  }

  // Créer le chemin complet dans le bucket
  const key = `${folder}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key, // Chemin dans le bucket
    Body: fileBuffer,
    ContentType: mimeType,
    /* ACL: "public-read", // Fichier accessible publiquement */
  };

  return s3.upload(params).promise();
};

module.exports = { uploadFileToS3 };
