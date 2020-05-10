<template>
  <div id="app">
    <div class="game" v-if="this.me != null">
      <div class="mot-container"><Mot></Mot></div>
      <div class="players-container">
        <Player
          v-for="player in this.players"
          :key="player.id"
          v-bind:player="player"
        ></Player>
      </div>
    </div>
    <div v-else class="text-field">
      <input v-model="inputPseudo" type="text" /><button @click="startGame">
        Commencer la partie
      </button>
    </div>
  </div>
</template>

<script>
import Mot from "./components/Word";
import Player from "./components/Player";
import PlayerModel from "../models/Player.js";
export default {
  name: "App",
  components: {
    Mot,
    Player,
  },
  data: function() {
    return {
      players: [],
      me: null,
      inputPseudo: "",
    };
  },
  sockets: {
    connect: function() {
      console.log("bravo je suis connecté au serveur");
    },
    userJoin: function(player) {
      console.log("evenment : quelqu'un vient de joindre la partie");
      this.players.push(player);
    },
  },
  methods: {
    startGame: function() {
      if (this.inputPseudo != "") {
        this.me = new PlayerModel(this.inputPseudo);
        this.players.push(this.me);
        this.$socket.emit("userJoin", this.me);
      }
    },
  },
};
</script>

<style>
* {
  font-size: 22px;
  font-family: "Source Sans Pro", "Arial", sans-serif;
}
.mot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  background-color: #e7e7e7;
}
.players-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
}
</style>
