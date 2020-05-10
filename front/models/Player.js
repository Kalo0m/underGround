class PlayerModel {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.mots = [];
  }
  addMot(mot) {
    this.mots.push(mot);
  }
}
export default PlayerModel;
