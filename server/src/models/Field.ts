export interface Field {
  event: EventType | undefined;
}

export enum EventType {
  VOCAB,
  GRAMMAR,
  PERSON,
  CITY,
}
