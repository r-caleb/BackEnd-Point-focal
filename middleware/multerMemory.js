// middlewares/multerMemory.js
const multer = require("multer");

// On stocke le fichier en mémoire pour pouvoir le manipuler nous-mêmes
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
