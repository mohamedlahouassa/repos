var express = require("express");
const axios = require("axios");

let router = express.Router();
var { con } = require("../../../db");
var { run } = require("./utils");
const { verifyToken } = require("../utils");
var FormData = require("form-data");

router.post("/start", (req, res) => {
  const id = req.body.id;
  console.log("start : " + id);
  con.query(
    "update clients set approuved = true,last= ? where id = ? and approuved = false",
    [new Date(), id],
    (err, result) => {
      if (err) throw err;
      run();
      res.send(result);
    }
  );
});

router.post("/stop", (req, res) => {
  const id = req.body.id;
  console.log("stop : " + id);
  con.query(
    "update clients set approuved = false,last=NULL where id=? and approuved = true",
    [id],
    (err, result) => {
      if (err) throw err;
      run();
      res.send(result);
    }
  );
});
router.post("/configure", (req, res) => {
  var { id, username, password, email, sitetitle } = req.body;
  con.query("select * from clients where id= ?", id, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const reso = result[0];
      if (reso.sitetitle || reso.email) {
        res.send({ pre: false, message: "ce client est deja configurer" });
      } else {
        if (reso.approuved) {
          con.query(
            "update clients set sitetitle=? ,email= ? where id = ?",
            [sitetitle, email, id],
            (err, result) => {
              if (err) throw err;
              console.log(result);
              if (result.changedRows > 0) {
                res.send({ pre: true, message: "configurerr" });
              }
            }
          );
        } else {
          res.send({ pre: false, message: "client n'est paas lancée" });
        }
      }
    } else {
      res.send({ pre: false, message: "no client" });
    }
  });
});

module.exports = router;
