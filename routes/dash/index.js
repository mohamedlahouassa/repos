var express = require("express");
let router = express.Router();
var login = require("./login");
var launch = require("./launch");
var client = require("./client");

router.use("/login", login);
router.use("/client", client);
router.use("/launch", launch);

router.get("/", (req, res) => {
  res.send("Dash Page");
});
module.exports = router;
