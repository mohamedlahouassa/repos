const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.json({ auth: false, message: "erreur dans le serveur1" });
  } else {
    jwt.verify(token, process.env.DASHTOKEN, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "erreur dans le serveur2" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};
module.exports.verifyToken = verifyToken;
