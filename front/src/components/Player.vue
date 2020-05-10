<template>
  <div class="container">
    {{ player.pseudo }}
    <div class="messages">
      <p class="message" v-for="mot in player.mots" :key="mot.id">{{ mot }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["player"],
  data: function() {
    return {};
  },
};
</script>
<style scoped>
.container {
  text-align: center;
  width: 100%;
  margin: 20px;
  background: pink;
}
</style>
