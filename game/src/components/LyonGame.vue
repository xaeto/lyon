<template>
  <div class="board">
    <div class="field" v-bind:style="{ top: field.y + 'px', left: field.x + 'px' }" v-for="(field, index) in fields" :key="index">
    </div>
  </div>
  <div v-if="!started">
    <input v-model="player_name" placeholder="Spieler hinzufuegen">
    <button v-on:click="add_player()">Add Player</button>
    <button v-on:click="start_game()">Spiel starten</button>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

import game_data from "../game.json"
import { Vue } from "vue-class-component";
import { Player } from "./../models/player";
import { Field } from "./../models/field";
import { FieldType } from "./../models/field-type";

export default class LyonGame extends Vue {
  players: Player[] = [];
  next_player = 0;

  player_name = "";
  player_color = "";

  started = false;

  current_event = Field;

  add_player(){
    if (this.player_name !== undefined){
      this.players.push(
        {
          name: this.player_name,
          color: this.player_color,
          pos: 0
        }
      );
    }
  }

  start_game(){
    console.log('starting game');
    this.started = true;
  }

  reset_game(){
    this.players = [];
    this.started  = false;
  }

  throw_dice() : number {
    return Math.floor(Math.random() * 6) + 1;
  }


  answer_event(answer_index){
    this.next_player++;
  }

  eval_event(field: Field){
    switch(field.type){
      case FieldType.GRAMMAR:
        this.eval_grammar_event();
        break;
      case FieldType.VOCAB:
        this.eval_vocab_event();
        break;
      case FieldType.FIGURE:
        this.eval_figure_event();
        break;
      case FieldType.CITY:
        this.eval_city_event();
        break;
    }
  }

  eval_grammar_event(){
    console.log('debug');
  }

  eval_vocab_event(){
    console.log('debug');
  }

  eval_figure_event(){
    console.log('debug');
  }

  eval_city_event(){
    console.log('debug');
  }

  step(){
    let current_player = this.players[this.next_player];

    // advance player pos
    current_player.pos += this.throw_dice();

    // check if there's already a player on that field
    const existing_player_index = this.players.findIndex(p => p.pos == current_player.pos);

    // check if already a player on that field
    if(existing_player_index > 0){
      this.players[existing_player_index].pos = 0;
    }

    const fields = this.getFields();
    let field = fields[current_player.pos];

    if(field.type !== undefined){
      this.eval_event(field);
    }
  }

  getEventColor(fieldType: FieldType): string{
    switch(fieldType){
      case FieldType.GRAMMAR:
        return "red";
      case FieldType.VOCAB:
        return "white";
      case FieldType.FIGURE:
        return "blue";
      case FieldType.CITY:
        return "green";
      default:
      return "gray";
    }
  }

  getFields(): Field[] {
    return game_data.fields.map(v => {
      let obj = new Field();
      obj.color = this.getEventColor(FieldType[v.type as keyof typeof FieldType]);
      obj.x = v.x;
      obj.y = v.y;
      return obj;
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
