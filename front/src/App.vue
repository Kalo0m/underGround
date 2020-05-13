<template>
  <div id="app">
    <div class="game" v-if="this.gameStarted">
      <div class="mot-container"><Mot v-bind:word="this.word"></Mot></div>
      <div class="players-container">
        <Player
          v-for="player in this.players"
          :key="player.id"
          v-bind:player="player"
        ></Player>
      </div>
      <input type="text" @keyup.enter="addMot" /><br /><br />
      <button v-if="this.me.isAdmin" @click="goToVote">passer aux votes</button>
    </div>
    <div v-else-if="this.gameLoading" class="text-field">
      liste des joueurs
      <div class="players-container">
        <div v-for="player in this.players" :key="player.id">
          {{ player.pseudo }}
        </div>
      </div>
      <p v-if="this.lobbyId != null">id of the lobby : {{ this.lobbyId }}</p>
      <button v-if="this.me.isAdmin" @click="startGame">
        Commencer la partie
      </button>
    </div>
    <div v-else-if="this.gameVote" class="text-field">
      choisissez le joueur pour qui voter :
      <div class="players-container">
        <div v-for="player in this.players" :key="player.id">
          {{ player.nbVotes }} {{ player.pseudo }}
          <button @click="voteForAPlayer(player)">Voter pour ce joueur</button>
        </div>
      </div>
    </div>
    <div v-else-if="this.gameResult" class="text-field">
      RESULT, l'intru était {{ this.intru.pseudo }}
      Votre score : {{ this.score }}
      <p v-if='this.intru.id === this.voteFor.id' class='green'>GAGNÉ</p>
      <p v-else class='red'>PERDU</p>
      <button v-if='this.me.isAdmin' @click='newWord'>Nouveau mot</button>
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
const { v4: uuidv4 } = require("uuid");

var socket = io.connect("http://192.168.1.20:4000");
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
      word: "",
      inputPseudo: "",
      uuidInput: "",
      gameStarted: false,
      gameLoading: false,
      gameVote: false,
      gameResult: false,
      intru: null,
      error: null,
      lobbyId: null,
      voteFor: null,
      score : 0,
    };
  },

  methods: {
    createGame: function() {
      if (this.inputPseudo != "") {
        this.me = new PlayerModel(this.inputPseudo, true);
        const uuid = uuidv4().split("-")[0];
        this.lobbyId = uuid;
        this.me.lobbyId = uuid;
        this.players.push(this.me);
        socket.emit("createGame", this.me, uuid);
        this.gameLoading = true;
      }
    },
    joinGame: function() {
      if (this.uuidInput != "" && this.inputPseudo != "") {
        this.me = new PlayerModel(this.inputPseudo);
        this.me.lobbyId = this.uuidInput;
        this.players.push(this.me);
        socket.emit("joinGame", this.me, this.uuid);
        this.gameLoading = true;
      }
    },
    startGame: function() {
      if (
        this.players.length >= config.MIN_PLAYER &&
        this.players.length <= config.MAX_PLAYER
      ) {
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

    voteForAPlayer: function(player) {
      if (this.voteFor === null) {
        socket.emit("voteForAPlayer", this.me, player);
        this.voteFor = player;
      } else this.error = "vous avez déjà voté !"; // vote pour un joueur
    },
    goToVote: function() {
      this.gameStarted = false;
      this.gameVote = true;
      socket.emit("goToVote", this.me);
    },
    newWord : function(){
      this.initMe();
      socket.emit('newWord',this.lobbyId);
    },
    initMe : function(){
      this.voteFor = null;
      this.intru = null;
      this.players.forEach(element =>{
        element.mots = [];
        element.nbVotes = 0;
        element.isIntru = false;
      })
    }
  },
  mounted() {
    socket.on("userJoinSend", (player) => {
      console.log("un mec est arrivé dans notre game !");
      this.players.push(player);
    });
    socket.on("initialisation", (players) => {
      this.players = players;
    });
    socket.on("gameStarted", (words, playerIdOfIntru) => {
      console.log("get initialized");
      this.gameStarted = true;
      this.gameLoading = false;
      this.me.id === playerIdOfIntru
        ? (this.word = words[1])
        : (this.word = words[0]);
    });
    socket.on("sendMot", (mot, player) => {
      this.players.find((item) => item.id === player.id).mots.push(mot);
    });
    socket.on("gotoVote", () => {
      this.gameStarted = false;
      this.gameVote = true;
    });
    socket.on("voteForAPlayer", (player,nbVotes) => {
      
      this.players.find((item) => item.id === player.id).nbVotes = nbVotes;
    });
    socket.on("result", (lobby) => {
      console.log(lobby);
      this.intru = this.players.find((item) => item.id === lobby.intruId);
      this.score = lobby.players.find(item=>item.id === this.me.id).score;
      this.voteFor
      console.log(lobby);
      this.gameVote = false;
      this.gameResult = true;
    });
    socket.on('newWord', (words, playerIdOfIntru)=>{
      this.initMe();
      this.gameResult = false;
      this.gameStarted = true;
      this.me.id === playerIdOfIntru
        ? (this.word = words[1])
        : (this.word = words[0]);
      
    });
  },
};
</script>

<style>
* {
  font-size: 22px;
  font-family: "Source Sans Pro", "Arial", sans-serif;
}
.red{
  width:100px;
  text-align:center;
  padding:20px;
  background-color: red;
}
.green{
    padding:20px;

  width:100px;
  text-align:center;
  background-color: green;
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
  height: 200px;
  align-items: stretch;
  justify-content: space-around;
}
</style>
