import { randomInt, randomEnum } from "../utils";
import { Board } from "./Board";
import { EventType } from "./Field";

class Game {
  board: Board = new Board();

  constructor(fieldCount: number, eventPercentage: number) {
    for (let i = 0; i < fieldCount; i++) {
      if (eventPercentage >= randomInt(0, 100)) {
        this.board.addField();
      } else {
        this.board.addField(randomEnum(EventType));
      }
    }
  }

  run() {}
}
