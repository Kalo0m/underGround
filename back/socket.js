var io;
const setIo = function (nIo) {
  io = nIo;
  var users = [];
  io.on("connection", function (socket) {
    console.log("someone connected");
    socket.on("userJoin", function (player) {
      console.log("un mec est arrivé");
      socket.broadcast.emit("userJoin", player);
    });
  });
};
module.exports = setIo;
