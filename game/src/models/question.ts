import { Answer } from "./answer";
import { FieldType } from "./field-type";

export class Question {
  type: FieldType | undefined;
  question = "";
  answers: Answer[] = [];
}
