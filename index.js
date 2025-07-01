const app = require("./app");
const http = require("http").Server(app);
require("dotenv").config();


http.listen(process.env.PORT || 5000, () =>
  console.log("Adresse du serveur : http://localhost:5000")
);
