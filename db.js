var mysql = require("mysql");
require("dotenv").config();
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.con = con;
