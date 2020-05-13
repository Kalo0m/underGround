var express = require("express");
var app = express();
const server = app.listen(4000, function () {
  console.log("server running on port 4000");
});
var io = require("socket.io")(server);
require("./socket")(io);

app.get("/eliott", function (req, res) {
  res.send("Bienvenu sur mon serveur");
});
