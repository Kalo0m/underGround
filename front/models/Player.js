const { v4: uuidv4 } = require("uuid");

class PlayerModel {
  constructor(pseudo, isAdmin, lobbyId) {
    this.pseudo = pseudo;
    this.mots = [];
    this.isAdmin = isAdmin || false;
    this.id = uuidv4();
    this.lobbyId = lobbyId || null;
  }
  addMot(mot) {
    this.mots.push(mot);
  }
  toString() {
    return "nom : ${this.pseudo}";
  }
}
export default PlayerModel;
