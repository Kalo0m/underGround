let Lobby = require("./lobby");
const setIo = function (nIo) {
  let io = nIo;
  var lobbys = [];
  io.on("connection", function (socket) {
    console.log("someone connected");
    socket.on("createGame", function (player) {
      let newLobby = new Lobby();
      newLobby.userJoin(player, socket);
      lobbys.push(newLobby);
    });
    socket.on("joinGame", function (player, uuid) {
      lobbys.find((item) => item.uuid === uuid).userJoin(player, socket);
      socket.emit(
        "initialisation",
        lobbys.find((item) => item.uuid === uuid).players
      );
    });
    socket.on("gameStarted", function (player) {
      const lobby = lobbys.find((item) =>
        item.players.map((item) => item.id).includes(player.id)
      );
      socket.broadcast.to(lobby.uuid).emit("gameStarted");
    });
    socket.on("messageSend", function (mot, player) {
      lobbys
        .find((item) => item.players.map((item) => item.id).includes(player.id))
        .addMot(mot, player, socket);
    });
  });
};
module.exports = setIo;
