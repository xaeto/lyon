<template>
  <div class="board">
    <div class="field" v-bind:style="{ top: field.y + 'px', left: field.x + 'px' }" v-for="(field, index) in fields" :key="index">
    </div>
  </div>
</template>

<script lang="ts">

import game_data from "../game.json"
import { Vue } from "vue-class-component";

export default class LyonGame extends Vue {
  addPlayer(name: string){
    console.log(name);
  }

  getFields() {
    return game_data.fields.map(v => {
      return {
        type: v.type,
        x: v.x,
        y: v.y,
      }
    });
  }

  data() {
    return {
      fields: this.getFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  background: url("./../assets/board.svg");
  width: 800px;
  height: 800px;
  z-index: -100;
  position: relative;
}

.field {
  position: absolute;
  transform: translate(50%, 50%);
  background: purple;
  border-radius: 50%;
  width: 32px;
  height: 32px;

  border: solid black 2px;
}
</style>
