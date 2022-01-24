<template>
  <button v-on:click="step()">Wuerfeln</button>
  <div class="board">
    <div class="field" v-bind:style="{ top: field.y + 'px', left: field.x + 'px' }" v-for="(field, index) in fields" :key="index">
    </div>
    <div v-for="(player, index) in players" 
      :key="index" 
      class="player"
      v-bind:style="{ top: get_pos_y(player.pos) + 'px', left: get_pos_x(player.pos)  + 'px', background: player.color }">
    </div>
    <div v-if="current_question">
      <div class="card type-grammar">
        <span class="card-title">{{ current_question.text }}</span>
      </div>
      <a v-for="(answer, index) in current_question.answers" :key="index">
        {{ answer.text }}
        <br>
      </a>
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
  <div v-if="finished">
    <label>
      {{ winner }} gewinnt
    </label>
    <button v-on:click="reset_game()">Nochmal Spielen</button>
  </div>
</template>

<script lang="ts">

import game_data from "../game.json"

import { Field } from "./../models/field";
import { FieldType } from "./../models/field-type";
import { Player } from "./../models/player";
import { Question } from "@/models/question";
import { Vue } from "vue-class-component";

export default class LyonGame extends Vue {
  players: Player[] = [];
  next_player = 0;

  player_name: string | undefined = "";
  player_color = "";

  started = false;
  finished = false;

  winner: string | undefined;

  current_event: Field | undefined;
  current_question: Question | undefined;
  answer_correct: boolean | undefined;

  add_player(){
    if (this.player_name !== undefined){
      this.players.push(
        {
          name: this.player_name,
          color: "green", // this.player_color,
          pos: 0
        }
      );
    }
    this.player_name = "";
  }

  get_pos_x(pos_index: number): number{
    console.log('index x: ', pos_index);
    return this.get_fields()[pos_index].x;
  }

  get_pos_y(pos_index: number): number {
    console.log('index y: ', pos_index);
    return this.get_fields()[pos_index].y;
  }

  start_game(){
    console.log('starting game');
    this.started = true;
  }

  reset_game(){
    this.players = [];
    this.started  = false;
    this.winner = undefined;
    this.current_question = undefined;
    this.answer_correct = undefined;
  }

  throw_dice() : number {
    return Math.floor(Math.random() * 6) + 1;
  }

  answer_event(answer_index: number){
    if (this.current_question !== undefined){
      const answer = this.current_question.answers[answer_index];
      this.answer_correct = !!answer;
      this.next_player++;
    }
  }

  get_random_question(type: FieldType): Question{
    const questions = this.get_questions().filter(e=>e.type == type);
    const index = Math.floor(Math.random() *  questions.length -1) + 1;

    console.log('question index: ', index);

    return questions[index];
  }

  async step(){
    let current_player = this.players[this.next_player];
    if(current_player.pos === -1 ){
      current_player.pos = 0;
      current_player.pos += this.throw_dice();
    }else{
      current_player.pos += this.throw_dice() -1;
    }

    // advance player pos
    await this.$nextTick();

    // check if there's already a player on that field
    const existing_player_index = this.players.findIndex(p => p.pos == current_player.pos);

    // check if already a player on that field
    if(existing_player_index !== this.next_player){
      this.players[existing_player_index].pos = 0;
    }

    const fields = this.get_fields();
    let field = fields[current_player.pos];
    console.log(field.type?.toString());

    if(field.type !== undefined){
      this.current_event = field;
      console.log('event');
      this.current_question = this.get_random_question(field.type);
    }

    if (current_player.pos >= this.get_fields().length)
  {
      this.finished = true;
      this.winner = current_player.name;
    }
    this.$nextTick();
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

  get_fields(): Field[] {
    return game_data.fields.map(v => {
      let t = FieldType[v.type as keyof typeof FieldType];
      let obj = new Field();
      obj.type = t;
      obj.color = this.getEventColor(t);
      obj.x = v.x;
      obj.y = v.y;
      return obj;
    });
  }

  get_questions(): Question[]{
    return game_data.questions.map(question => 
    {
        let q = new Question();
        q.type = FieldType[question.type as keyof typeof FieldType]
        q.question = question.question;
        q.answers = question.answers
        return q;
      });
  }

  data() {
    return {
      fields: this.get_fields(),
      current_question: this.current_question,
      current_event: this.current_event,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hidden {
  display: none !important;
}
.board {
  background: url("./../assets/board.svg");
  width: 800px;
  height: 800px;
  z-index: -100;
  position: relative;
}

.player {
  position: absolute;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
}

.field {
  position: absolute;
  transform: translate(-50%, -50%);
  background: purple;
  border-radius: 50%;

  width: 32px;
  height: 32px;

  z-index: -50;
  border: solid black 2px;
}
</style>
