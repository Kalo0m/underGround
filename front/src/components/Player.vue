<template>
  <span>{{ player.pseudo }}</span>
</template>

<script>
export default {
  props: ["player"],
  data: function() {
    return {};
  },
};
</script>
<style>
span {
  margin: 20px;
}
</style>
