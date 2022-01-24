enum FieldType {
  GRAMMAR,
  VOCAB,
  FIGURE,
  CITY
}

export interface Field {
  color: string;
  type: FieldType;
  x: number;
  y: number;
}
