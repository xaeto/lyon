var game = {
  fields: [
    {
      x: 35,
      y: 35,
    },
    {
      x: 95,
      y: 35,
      event: "grammar",
    },
    {
      x: 155,
      y: 35,
    },
    {
      x: 215,
      y: 35,
      event: "grammar",
    },
  ],
  players: [
    {
      disabled: false,
      position: 0,
      color: "red",
    },
    {
      disabled: false,
      position: 0,
      color: "blue",
    },
  ],
  cards: {
    grammar: [
      {
        question: "Test Question",
        anwser: "Test Anwser",
      },
    ],
  },
}
