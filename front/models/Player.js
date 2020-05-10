const { v4: uuidv4 } = require("uuid");

class PlayerModel {
  constructor(pseudo, isAdmin) {
    this.pseudo = pseudo;
    this.mots = ["mesage1", "message2"];
    this.isAdmin = isAdmin || false;
    this.id = uuidv4();
  }
  addMot(mot) {
    this.mots.push(mot);
  }
  toString() {
    return "nom : ${this.pseudo}";
  }
}
export default PlayerModel;
