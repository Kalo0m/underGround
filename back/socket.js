let Lobby = require("./lobby");
var lobbys = [];

const setIo = function (nIo) {
  let io = nIo;
  io.on("connection", function (socket) {
    console.log("someone connected");
    socket.on("createGame", function (player, uuid) {
      console.log("quelqu'un a créé un lobby : id = " + uuid);
      userJoin(player, uuid, socket);
    });
    socket.on("joinGame", function (player) {
      userJoin(player, player.lobbyId, socket);
      console.log(lobbys[player.lobbyId]);
      socket.emit("initialisation", lobbys[player.lobbyId]);
    });
    socket.on("gameStarted", function (player) {
      console.log("aaaaaa");
      const lobby = Object.values(lobbys).find((
        item // on récupère le lobby du player passé en parametre
      ) => item.includes(item.find((item2) => item2.id === player.id)));
      var lobbyID;
      Object.entries(lobbys).forEach(([clé, valeur]) => {
        if (valeur === lobby) lobbyID = clé;
      });
      console.log("id : " + lobbyID);
      console.log("res : ");
      console.log(lobby);
      socket.broadcast.to(lobbyID).emit("gameStarted");
    });
    socket.on("messageSend", function (mot, player) {
      socket.broadcast.to(player.lobbyId).emit("sendMot", mot, player);
    });
  });
};
function userJoin(player, uuid, socket) {
  if (!lobbys[uuid]) lobbys[uuid] = [];
  lobbys[uuid].push(player);
  console.log(player);
  console.log(uuid);
  console.log(player.lobbyId);
  console.log(lobbys[player.lobbyId]);
  socket.join(uuid);
  socket.broadcast.to(uuid).emit("userJoinSend", player);
}

module.exports = setIo;
