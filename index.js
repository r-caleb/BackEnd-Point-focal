const app = require("./app");
const http = require("http").Server(app);
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
