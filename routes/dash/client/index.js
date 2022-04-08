var express = require("express");

let router = express.Router();
var { con } = require("../../../db");

const { verifyToken } = require("../utils");

router.get("/", verifyToken, (req, res) => {
  con.query("select * from clients where true", (err, result) => {
    if (err) throw err;
    else res.json({ auth: true, data: result });
  });
});
router.post("/get", verifyToken, (req, res) => {
  const { id } = req.body;
  con.query("select * from clients where id= ?", [id], (err, result) => {
    if (err) throw err;
    else res.json({ auth: true, data: result });
  });
});
router.post("/add", verifyToken, (req, res) => {
  const { name, username, type, password } = req.body;
  if (
    name.trim() == "" ||
    username.trim() == "" ||
    password.trim() == "" ||
    type.trim() == ""
  ) {
    return res.json({ auth: false, message: "verifier un champ vide" });
  } else {
    con.query(
      "insert into clients (name,username,password,type,approuved)values(?,?,?,?,?)",
      [name, username, password, type, false],
      (err, result) => {
        if (err) res.json({ auth: false, message: "erreur dans le serveur" });
        res.json({ auth: true, message: "utilisateur bien ajouté !" });
      }
    );
  }
});
router.post("/delete", verifyToken, (req, res) => {
  var { id } = req.body;
  if (!id) {
    res.json({ client: false, message: "selectionner un client" });
  }
  con.query("delete from clients where id = ?", [id], (err, result) => {
    if (err) res.json({ client: false, message: "erreur dans serveur" });

    res.json({ client: true, message: "client bien supprimer" });
  });
});
router.get("/types", verifyToken, (req, res) => {
  con.query("SELECT DISTINCT type FROM clients", (err, result) => {
    if (err) res.json({ type: false, message: "error dans les types" });
    res.json({ type: true, data: result });
  });
});
module.exports = router;
