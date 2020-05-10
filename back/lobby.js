const { v4: uuidv4 } = require("uuid");
const MIN_PLAYER = 2;
const MAX_PLAYER = 6;
class Lobby {
  constructor() {
    this.uuid = uuidv4().split("-")[0];
    console.log("lobby crée, uuid = ${this.uuid}");
    this.players = [];

    console.log(this.uuid);
  }
  userJoin(player, socket) {
    this.players.push(player);
    socket.join(this.uuid);
    socket.broadcast.to(this.uuid).emit("userJoinSend", player);
    console.log(this.players);
  }
  addMot(mot, player, socket) {
    socket.broadcast.to(this.uuid).emit("sendMot", mot, player);
  }
}
module.exports = Lobby;
