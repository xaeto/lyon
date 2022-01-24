<template>
  <lyon-game></lyon-game>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LyonGame from "./components/LyonGame.vue";

@Options({
  components: {
    LyonGame,
  },
})
export default class App extends Vue {}
</script>

<style>

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
