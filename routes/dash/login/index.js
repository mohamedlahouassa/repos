var express = require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");
var { con } = require("../../../db");
const { verifyToken } = require("../utils");

router.post("/", (req, res) => {
  const user = req.body;

  con.query(
    "SELECT * from admin where username=? and password=?",
    [user.username, user.password],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const id = result[0].id;
        const username = user.username;
        const password = user.password;
        const token = jwt.sign(
          { id: id, username: username },
          process.env.DASHTOKEN,
          { expiresIn: 100000 }
        );
        res.json({ auth: true, token: token, user: result[0] });
      } else {
        res.json({
          auth: false,
          message: "mauvaise combinaison nom d'utilisateur/mot de passe",
        });
      }
    }
  );
});
router.get("/isAuth", verifyToken, (req, res) => {
  const id = req.userId;
  con.query("select * from admin where id =?", id, (err, result) => {
    if (err) res.json({ auth: false, message: "erreur dans le serveur" });
    res.json({ auth: true, user: result[0] });
  });
});
module.exports = router;
