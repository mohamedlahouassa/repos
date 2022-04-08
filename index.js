var express = require("express");
var app = express();
var cors = require("cors");
const path = require("path");

app.use(cors());
const { createServer } = require("http");
app.use(express.json());
require("dotenv").config();
app.use(express.static(path.join(__dirname, "client", "build")));

var dash = require("./routes/dash");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});
app.get("/", (req, res) => {
  res.send("hamoudi");
});
var sockets = [];
var admin;
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const adm = socket.handshake.query.adm;

  if (id === "1") {
    admin = socket.id;
  } else {
    sockets[id] = socket.id;
  }
  socket.on("addType", (data) => {
    var a = data.to === 1 ? admin : sockets[data.to];
    io.to(a).emit("typeAdd", {
      message: " a ajoute ce type " + data.type,
    });
  });
  socket.on("removeType", (data) => {
    var a = data.to === 1 ? admin : sockets[data.to];
    io.to(a).emit("typeRemove", {
      message: " a supprimer ce type " + data.type,
    });
  });
  socket.on("addFile", (data) => {
    console.log(data);
    var a = data.to === 1 ? admin : sockets[data.to];
    io.to(a).emit("fileAdd", {
      type: data.type,
      message: " a ajouter ce fichier " + data.file,
    });
  });
  socket.on("removeFile", (data) => {
    console.log(data);
    var a = data.to === 1 ? admin : sockets[data.to];
    io.to(a).emit("fileRemove", {
      type: data.type,
      message: " a supprimer ce fichier " + data.file,
    });
  });
});

app.use("/dash", dash);
httpServer.listen(process.env.PORT);
