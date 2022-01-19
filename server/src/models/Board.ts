import { randomInt } from "../utils";
import { Field, EventType } from "./Field";
import { Player } from "./Player";

export class Board {
  accessCode: number;
  players: Player[] = [];
  fields: Field[] = [];

  constructor() {
    this.accessCode = randomInt(1000, 9999);
  }

  regenerateAccessCode() {
    this.accessCode = randomInt(1000, 9999);
    return this.accessCode;
  }

  addField(event?: EventType) {
    this.fields.push({ event: event });
  }

  removeField(id: number) {
    this.fields.splice(id, 1);
  }

  addPlayer(name: string, color: string) {
    this.players.push({ name: name, color: color, position: 0 });
    return this.players.length - 1;
  }

  removePlayer(id: number) {
    this.players.splice(id, 1);
  }

  movePlayer(id: number, amount: number) {
    this.players[id].position += amount;
    return this.players[id].position;
  }
}
