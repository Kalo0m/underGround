let words = require("./words");
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
      // récupération du lobby du player
      const lobby = Object.values(lobbys).find((item) =>
        item.includes(item.find((item2) => item2.id === player.id))
      );
      var lobbyID;
      // récupération de l'id du lobby
      Object.entries(lobbys).forEach(([clé, valeur]) => {
        if (valeur === lobby) lobbyID = clé;
      });
      // récupération d'un couple de mots
      randomCoupleOfWords = words[getRandomInt(lobby.length)];
      console.log(randomCoupleOfWords);
      randomPlayerId = lobby[getRandomInt(lobby.length)].id;
      console.log("pour etre sur");
      console.log(socket.rooms);
      io.in(lobbyID).emit("gameStarted", randomCoupleOfWords, randomPlayerId);
    });
    socket.on("messageSend", function (mot, player) {
      socket.broadcast.to(player.lobbyId).emit("sendMot", mot, player);
    });
  });
};
function userJoin(player, uuid, socket) {
  if (!lobbys[uuid]) lobbys[uuid] = [];
  lobbys[uuid].push(player);
  socket.join(uuid);
  socket.broadcast.to(uuid).emit("userJoinSend", player);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
module.exports = setIo;
