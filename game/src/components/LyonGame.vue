<template>
  <div class="board">
    <img src="./../assets/board.svg" alt="" />
    <div
      class="field"
      v-bind:style="{ '--field-y': field.y, '--field-x': field.x }"
      v-for="(field, index) in fields"
      :key="index"
    ></div>
    <div
      v-for="(player, index) in players"
      :key="index"
      class="player"
      v-bind:style="{
        '--player-y': get_pos_y(player.pos),
        '--player-x': get_pos_x(player.pos),
        '--player-color': player.color,
      }"
    ></div>
  </div>
  <div class="dice">
    <button class="dice-button" v-on:click="step()">Wuerfeln</button>
  </div>
  <div class="card" v-if="current_question && current_question.type">
    <div
      v-bind:class="
        'type-' + current_question.type
          ? FieldType[current_question.type].toString().toLower()
          : 'none'
      "
    >
      <span class="card-title">{{ current_question.text }}</span>
    </div>
    <a v-for="(answer, index) in current_question.answers" :key="index">
      {{ answer.text }}
      <br />
    </a>
  </div>
  <div v-if="!started" class="menu">
    <div class="menu-add">
      <input v-model="player_name" placeholder="Spieler hinzufuegen" />
      <button v-on:click="add_player()">+</button>
    </div>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        {{ player.name }}
      </li>
    </ul>
    <button class="menu-start" v-on:click="start_game()">Spiel starten</button>
  </div>
  <div v-if="finished" class="hidden">
    <label> {{ winner }} gewinnt </label>
    <button v-on:click="reset_game()">Nochmal Spielen</button>
  </div>
</template>

<script lang="ts">
import game_data from "../game.json";

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

  add_player() {
    if (this.player_name !== undefined) {
      this.players.push({
        name: this.player_name,
        color: "green", // this.player_color,
        pos: 0,
      });
    }
    this.player_name = "";
  }

  get_pos_x(pos_index: number): number {
    console.log("index x: ", pos_index);
    return this.get_fields()[pos_index].x;
  }

  get_pos_y(pos_index: number): number {
    console.log("index y: ", pos_index);
    return this.get_fields()[pos_index].y;
  }

  start_game() {
    console.log("starting game");
    this.started = true;
  }

  reset_game() {
    this.players = [];
    this.started = false;
    this.winner = undefined;
    this.current_question = undefined;
    this.answer_correct = undefined;
  }

  throw_dice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  answer_event(answer_index: number) {
    if (this.current_question !== undefined) {
      const answer = this.current_question.answers[answer_index];
      this.answer_correct = !!answer;
      this.next_player++;
    }
  }

  get_random_question(type: FieldType): Question {
    const questions = this.get_questions().filter((e) => e.type == type);
    const index = Math.floor(Math.random() * questions.length - 1) + 1;

    console.log("question index: ", index);

    return questions[index];
  }

  async step() {
    let current_player = this.players[this.next_player];
    if (current_player.pos === -1) {
      current_player.pos = 0;
      current_player.pos += this.throw_dice();
    } else {
      current_player.pos += this.throw_dice() - 1;
    }

    // check if there's already a player on that field
    const existing_player_index = this.players.findIndex((p) => p.pos == current_player.pos);

    // check if already a player on that field
    if (existing_player_index !== this.next_player) {
      this.players[existing_player_index].pos = 0;
    }

    const fields = this.get_fields();
    let field = fields[current_player.pos];
    console.log(field.type?.toString());

    if (field.type !== undefined) {
      this.current_event = field;
      console.log("event");
      this.current_question = this.get_random_question(field.type);
    }

    if (current_player.pos >= this.get_fields().length) {
      this.finished = true;
      this.winner = current_player.name;
    }

    await this.$nextTick();
  }

  getEventColor(fieldType: FieldType): string {
    switch (fieldType) {
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
    return game_data.fields.map((v) => {
      let t = FieldType[v.type as keyof typeof FieldType];
      let obj = new Field();
      obj.type = t;
      obj.color = this.getEventColor(t);
      obj.x = v.x;
      obj.y = v.y;
      return obj;
    });
  }

  get_questions(): Question[] {
    return game_data.questions.map((question) => {
      let q = new Question();
      q.type = FieldType[question.type as keyof typeof FieldType];
      q.question = question.question;
      q.answers = question.answers;
      return q;
    });
  }

  data() {
    return {
      fields: this.get_fields(),
      current_question: this.current_question,
      current_event: this.current_event,
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hidden {
  display: none !important;
}

.board {
  --board-size: 10;
  position: relative;
  width: calc(100px * var(--board-size));
  height: calc(100px * var(--board-size));
  z-index: -100;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.board img {
  position: absolute;
  z-index: -50;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.field {
  --field-size: 50px;
  border: solid black 2px;
  position: absolute;
  width: var(--field-size);
  height: var(--field-size);
  z-index: -40;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  top: calc(var(--field-y) * var(--board-size) * 1px);
  left: calc(var(--field-x) * var(--board-size) * 1px);
}

.field-grammar {
  background-color: rgb(245, 158, 158);
}

.field-vocab {
  background-color: rgb(255, 233, 159);
}

.field-figure {
  background-color: rgb(116, 116, 223);
}

.field-city {
  background-color: rgb(138, 228, 138);
}

.field-none {
  background-color: rgb(105, 105, 105);
}

.field-start {
  background-color: rgb(255, 0, 242);
}

.player {
  --player-size: 2;
  position: absolute;
  transform: translate(-50%, calc(32px * var(--player-size) * -1));
  z-index: -25;
  width: calc(14px * var(--player-size));
  height: calc(14px * var(--player-size));
  background-color: black;
  border-radius: 50%;
  background-color: var(--player-color);
  top: calc(var(--player-y) * var(--board-size) * 1px);
  left: calc(var(--player-x) * var(--board-size) * 1px);
}

.player::after {
  position: absolute;
  content: "";
  background: url("./../assets/player_template.svg");
  width: calc(14px * var(--player-size));
  height: calc(32px * var(--player-size));
  z-index: -30;
  background-repeat: no-repeat;
}

.card {
  --card-size: 1.5;

  position: absolute;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--card-size) * 1.1rem);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  width: calc(var(--card-size) * 400px);
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.card .card-title {
  margin-bottom: 0.5em;
  padding: 0.1em;
  text-align: center;
  text-decoration: underline;
}

.card a {
  margin: 0.2em 0;
  text-decoration: none;
  color: black;
  line-height: 1.7;
  border: solid 1px black;
  padding: 0 0.5em;
  border-radius: 10px;
}

.color-red {
  background-color: #fe0000;
}
.color-blue {
  background-color: #0000fe;
}
.color-green {
  background-color: #7ffe00;
}
.color-organe {
  background-color: #fe7e00;
}
.color-yellow {
  background-color: #fefe00;
}
.color-aqua {
  background-color: #007f7e;
}
.color-puple {
  background-color: #4f1ec7;
}
.color-magenta {
  background-color: #7e007e;
}

.type-grammar {
  background-color: rgb(245, 158, 158);
}

.type-grammar a {
  background-color: rgb(245, 201, 201);
}

.type-vocab {
  background-color: rgb(255, 233, 159);
}

.type-vocab a {
  background-color: rgb(248, 236, 196);
}

.type-figure {
  background-color: rgb(116, 116, 223);
}

.type-figure a {
  background-color: rgb(171, 171, 231);
}

.type-city {
  background-color: rgb(138, 228, 138);
}

.type-city a {
  background-color: rgb(178, 235, 178);
}

.type-none {
  background-color: rgb(133, 133, 133);
}

.menu {
  --menu-size: 1.5;
  position: absolute;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--menu-size) * 1.1rem);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  width: calc(var(--menu-size) * 400px);
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
}

.menu-add {
  display: flex;
}

.menu button {
  border: none;
  outline: none;
}

.menu-add input {
  flex-grow: 1;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--menu-size) * 1.1rem);
  border: none;
  background: none;
  outline: none;
  border-radius: 10px;
}

.menu-start {
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--menu-size) * 1.1rem);
  border-radius: 10px;
  background: rgb(127, 236, 94);
}

.menu-add button {
  border-radius: 10px;
  width: 48px;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--menu-size) * 1.1rem);
  border-radius: 10px;
}

.menu li {
  list-style-type: none;
  margin: 0.2em 0;
  line-height: 1.7;
  border: solid 1px black;
  padding: 0 0.5em;
  border-radius: 10px;
}

.dice {
  --dice-size: 2;
  position: absolute;
  width: calc(var(--dice-size) * 100px);
  height: calc(var(--dice-size) * 100px);
  border-radius: 10px;
  background: none;
}

.dice button {
  border: none;
  outline: none;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--dice-size) * 2rem);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.dice span {
  display: grid;
  border-radius: 10px;
  background: white;
  font-family: "Shadows Into Light", cursive;
  font-size: calc(var(--dice-size) * 3rem);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100%;
  border-radius: 10px;
  place-items: center;
}

.spin {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
