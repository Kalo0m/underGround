const { v4: uuidv4 } = require("uuid");

class PlayerModel {
  constructor(pseudo, isAdmin, lobbyId) {
    this.pseudo = pseudo;
    this.mots = [];
    this.isAdmin = isAdmin || false;
    this.id = uuidv4();
    this.lobbyId = lobbyId || null;
    this.nbVotes = 0;
    this.isIntru = false;
    this.score = 0
  }
}
export default PlayerModel;
