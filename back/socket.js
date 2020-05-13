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
      socket.emit("initialisation", lobbys[player.lobbyId].players);
    });
    socket.on("gameStarted", function (player) {
      // récupération du lobby du player
      const lobby = Object.values(lobbys).find((item) =>
        item.players.includes(
          item.players.find((item2) => item2.id === player.id)
        )
      );
      var lobbyID;
      // récupération de l'id du lobby
      Object.entries(lobbys).forEach(([clé, valeur]) => {
        if (valeur === lobby) lobbyID = clé;
      });
      // récupération d'un couple de mots
      randomCoupleOfWords = words[getRandomInt(lobby.players.length)];
      console.log(randomCoupleOfWords);
      randomPlayerId = lobby.players[getRandomInt(lobby.players.length)].id;
      lobby.intruId = randomPlayerId;

      io.in(lobbyID).emit("gameStarted", randomCoupleOfWords, randomPlayerId);
    });
    socket.on("messageSend", function (mot, player) {
      socket.broadcast.to(player.lobbyId).emit("sendMot", mot, player);
    });
    socket.on("goToVote", function (player) {
      socket.broadcast.to(player.lobbyId).emit("gotoVote");
    });
    socket.on("voteForAPlayer", function (sender, player) {
      //enregsitrement du nombre de votes sur le serveur

      console.log("aaa");
      const lobby = Object.values(lobbys).find((item) =>
        item.players.includes(
          item.players.find((item2) => item2.id === player.id)
        )
      );
      lobby.players.find((item) => item.id === player.id).nbVotes++;
      lobby.players.find(item => item.id === sender.id).voteFor = player

      let nbVotes = lobby.players
        .map((item) => item.nbVotes)
        .reduce((pv, cv) => pv + cv, 0);
      console.log(nbVotes);
      console.log(lobbys[player.lobbyId]);
      //si on vote pour l'intru : on augmente le score
      if (player.id === lobbys[player.lobbyId].intruId) lobby.players.find((item) => item.id === sender.id).score += 200
      console.log('aaa');
      console.log(player.id === lobbys[player.lobbyId].intruId);
      //envoie du vote a tout le monde
      io.in(player.lobbyId).emit("voteForAPlayer", player, lobby.players.find((item) => item.id === player.id).nbVotes);

      //si tout le monde à voté on affiche les résultats
      if (nbVotes === lobby.players.length) {

        io.in(player.lobbyId).emit("result", lobby);
      }
    });
    socket.on('newWord', function (lobbyId) {
      console.log(lobbys);
      const randomPlayerId = lobbys[lobbyId].players[getRandomInt(lobbys[lobbyId].players.length)].id;
      lobbys[lobbyId].intruId = randomPlayerId;
      lobbys[lobbyId].players.forEach((element) => {
        element.nbVotes = 0;
        element.mots = [];
        element.voteFor = null;
      });
      console.log('envoie a tout le monde du nouveau mot');
      console.log(lobbys[lobbyId]);
      randomCoupleOfWords = words[getRandomInt(lobbys[lobbyId].players.length)];
      io.in(lobbyId).emit('newWord', randomCoupleOfWords, randomPlayerId);
    })
  });
};
function userJoin(player, uuid, socket) {
  if (!lobbys[uuid]) lobbys[uuid] = {};
  if (!lobbys[uuid].players) lobbys[uuid].players = [];

  lobbys[uuid].players.push(player);
  socket.join(uuid);
  console.log(lobbys);
  socket.broadcast.to(uuid).emit("userJoinSend", player);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getLobbyOfPlayer(player) { }
module.exports = setIo;
