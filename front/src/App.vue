<template>
  <div id="app">
    <div class="game" v-if="this.gameStarted">
      <div class="mot-container"><Mot></Mot></div>
      <div class="players-container">
        <Player
          v-for="player in this.players"
          :key="player.id"
          v-bind:player="player"
        ></Player>
      </div>
      <input type="text" @keyup.enter="addMot" />
    </div>
    <div v-else-if="this.gameLoading" class="text-field">
      liste des joueurs
      <div class="players-container">
        <div v-for="player in this.players" :key="player.id">
          {{ player.pseudo }}
        </div>
      </div>
      <button v-if="this.me.isAdmin" @click="startGame">
        Commencer la partie
      </button>
    </div>
    <div v-else>
      pseudo :
      <input v-model="inputPseudo" type="text" /><br /><br /><button
        @click="createGame"
      >
        Créer une partie</button
      ><button @click="joinGame">
        Rejoindre une partie</button
      ><input v-model="uuidInput" type="text" />
    </div>
    <p v-if="this.error != null">{{ error }}</p>
  </div>
</template>

<script>
import Mot from "./components/Word";
import Player from "./components/Player";
import io from "socket.io-client";
import config from "../config/config.js";
import PlayerModel from "../models/Player.js";
var socket = io.connect("http://localhost:4000");
console.log(config);
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
      uuidInput: "",
      gameStarted: false,
      gameLoading: false,
      error: null,
    };
  },

  methods: {
    createGame: function() {
      if (this.inputPseudo != "") {
        this.me = new PlayerModel(this.inputPseudo, true);
        console.log(this.me);
        this.players.push(this.me);
        socket.emit("createGame", this.me);
        this.gameLoading = true;
      }
    },
    joinGame: function() {
      if (this.uuidInput != "" && this.inputPseudo != "") {
        this.me = new PlayerModel(this.inputPseudo);
        socket.emit("joinGame", this.me, this.uuidInput);
        this.gameLoading = true;
      }
    },
    startGame: function() {
      if (
        this.players.length >= config.MIN_PLAYER &&
        this.players.length <= config.MAX_PLAYER
      ) {
        this.gameLoading = false;
        this.gameStarted = true;
        socket.emit("gameStarted", this.me);
      } else {
        this.error = "la room doit avoir entre 2 et 6 joueurs !";
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    },
    addMot: function(event) {
      this.players
        .find((item) => item.id === this.me.id)
        .mots.push(event.target.value);
      socket.emit("messageSend", event.target.value, this.me);
    },
  },
  mounted() {
    socket.on("userJoinSend", (player) => {
      console.log("un mec est arrivé dans notre game !");
      this.players.push(player);
    });
    socket.on("initialisation", (players) => {
      this.players = players;
    });
    socket.on("gameStarted", () => {
      this.gameStarted = true;
      this.gameLoading = false;
    });
    socket.on("sendMot", (mot, player) => {
      console.log("player qui a envoyé un mot :");
      console.log(this.players);
      console.log(this.players.find((item) => item.id === player.id));
      this.players.find((item) => item.id === player.id).mots.push(mot);
    });
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
  flex-wrap: no-wrap;
  width: 100%;
  height: 500px;
  align-items: stretch;
  justify-content: space-around;
}
</style>
