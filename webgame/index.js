var outsideDiceResolve, outsideCardResolve;
const GAME = {
  currentPlayer: 0,
  fields: [
    { x: 10, y: 10, type: "start" },
    { x: 10, y: 20, type: "vocab" },
    { x: 10, y: 30, type: "none" },
    { x: 10, y: 40, type: "city" },
    { x: 10, y: 50, type: "figure" },
    { x: 10, y: 60, type: "grammar" },
    { x: 10, y: 70, type: "finish" },
  ],
  colors: ["red", "blue", "green", "orange", "yellow", "aqua", "purple", "magenta"],
  players: [],
  cards: {
    grammar: [
      {
        question: "Test QUESTION",
        anwsers: [
          {
            text: "AW 1",
            correct: true,
          },
          {
            text: "AW 2",
            correct: false,
          },
        ],
      },
    ],
    vocab: [
      {
        question: "Test QUESTION",
        anwsers: [
          {
            text: "AW 1",
            correct: true,
          },
          {
            text: "AW 2",
            correct: false,
          },
        ],
      },
    ],
    figure: [
      {
        question: "Test QUESTION",
        anwsers: [
          {
            text: "AW 1",
            correct: true,
          },
          {
            text: "AW 2",
            correct: false,
          },
        ],
      },
    ],
    city: [
      {
        question: "Test QUESTION",
        anwsers: [
          {
            text: "AW 1",
            correct: true,
          },
          {
            text: "AW 2",
            correct: false,
          },
        ],
      },
    ],
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateFields() {
  board = document.getElementById("board");
  GAME.fields.forEach((field) => {
    newField = document.createElement("div");
    newField.setAttribute("class", `field field-${field.type}`);
    newField.style.setProperty("--field-x", field.x);
    newField.style.setProperty("--field-y", field.y);
    board.appendChild(newField);
  });
}

function addPlayer() {
  playername = document.getElementById("playerNameInput").value;
  newPlayer = {
    name: playername,
    pos: 0,
    color: GAME.colors[GAME.players.length],
    lastRoll: 0,
    lastAnwser: null,
  };
  GAME.players.push(newPlayer);
  updatePlayerList();
}

function updatePlayerList() {
  playerlist = document.getElementById("playerlist");
  playerlist.innerHTML = "";
  GAME.players.forEach((player) => {
    playerlist.innerHTML += `<li>${player.name}</li>`;
  });
}

function movePlayer(id, amount) {
  GAME.players[id].pos += amount;
  if (GAME.players[id].pos < 0) {
    GAME.players[id].pos = 0;
  }
  renderPlayer(id);
}

function renderPlayer(id) {
  board = document.getElementById("board");
  GAME.players.forEach((player, index) => {
    playerElement = document.getElementById(`player-${id}`);
    if (playerElement === null) {
      newPlayer = document.createElement("div");
      newPlayer.setAttribute("class", `player`);
      newPlayer.setAttribute("id", `player-${index}`);
      newPlayer.style.setProperty("--player-x", GAME.fields[player.pos].x);
      newPlayer.style.setProperty("--player-y", GAME.fields[player.pos].y);
      newPlayer.style.setProperty("--player-color", player.color);
      board.appendChild(newPlayer);
    } else {
      playerElement.style.setProperty("--player-x", GAME.fields[player.pos].x);
      playerElement.style.setProperty("--player-y", GAME.fields[player.pos].y);
    }
  });
}

function randomCard(cardType) {
  card = GAME.cards[cardType][Math.floor(Math.random() * GAME.cards[cardType].length)];
  console.log(card);
  return card;
}

function updateCard(card, cardType) {
  cardElement = document.getElementById("card");
  cardElement.innerHTML = `<span class="card-title">${card.question}</span>`;
  card.anwsers.forEach((anwser) => {
    cardElement.innerHTML += `<a class="correct correct${anwser.correct}")" href="">${anwser.text}</a>`;
  });
  cardElement.setAttribute("class", `card type-${cardType}`);
}

function rollDice() {
  return Math.floor(Math.random() * 6 + 1);
}

function showDice() {
  document.getElementById("dice-button").setAttribute("class", "spin");
}

function roll() {
  rolledNumber = rollDice();
  diceButtonElement = document.getElementById("dice-button");
  diceValueElement = document.getElementById("dice-value");
  diceButtonElement.setAttribute("class", "hidden");
  diceValueElement.setAttribute("class", "");
  diceValueElement.innerText = rolledNumber;
  GAME.players[GAME.currentPlayer].lastRoll = rolledNumber;
  setTimeout(() => {
    diceValueElement.setAttribute("class", "hidden");
  }, 1000);
  console.log(`Player ${GAME.currentPlayer} rolled a ${rolledNumber}`);
}

function checkAnwser(anwser) {
  GAME.players[GAME.currentPlayer].lastAnwser = anwser;
}

async function listenerDiceButton() {
  document.getElementById("dice-button").addEventListener("click", outsideDiceResolve);
}

async function waitForRoll() {
  return new Promise((resolve) => {
    outsideDiceResolve = resolve;
  });
}

async function listenerAwnserButton() {
  anwserElements = document.getElementsByClassName("correct");
  console.log(typeof anwserElements);
  anwserElements.forEach((element) => {
    classes = element.getAttribute("class");
    if (classes.toString().includes("correct-true")) {
      element.addEventListener("click", checkAnwser(true));
    } else {
      element.addEventListener("click", checkAnwser(false));
    }
  });
  document.getElementById("").addEventListener("click", outsideCardResolve);
}

async function waitForAnwser() {
  return new Promise((resolve) => {
    outsideCardResolve = resolve;
  });
}

generateFields();
updatePlayerList();

async function startGame() {
  document.getElementById("menu").setAttribute("class", "menu hidden");
  GAME.players.forEach((player) => {
    renderPlayer(player.id);
  });
  GAME.isPlaying = true;
  while (GAME.isPlaying) {
    await loop();
  }
}

async function loop() {
  showDice();
  await Promise.all([waitForRoll(), listenerDiceButton()]);
  roll();
  movePlayer(GAME.currentPlayer, GAME.players[GAME.currentPlayer].lastRoll);
  currentPlayerPos = GAME.players[GAME.currentPlayer].pos;

  // check for collision
  GAME.players.forEach((player, playerid) => {
    if (playerid !== GAME.currentPlayer && player.pos === currentPlayerPos) {
      movePlayer(playerid, -50);
    }
  });

  // check for finish
  if (currentPlayerPos >= GAME.fields.length) {
    GAME.isPlaying = false;
    //TODO: add winning sequence
    alert("Player has won");
    currentPlayer = 0;
  }

  //check for card event
  if (GAME.fields[currentPlayerPos] !== "none" && GAME.fields[currentPlayerPos] !== "start") {
    card = randomCard(GAME.fields[currentPlayerPos].type);
    updateCard(card, GAME.fields[currentPlayerPos].type);
    await Promise([waitForAnwser(), listenerAwnserButton()]);

    if (GAME.players[GAME.currentPlayer].lastAnwser === false) {
      movePlayer(GAME.currentPlayer, -5);
    }
  }

  // advance to next player
  GAME.currentPlayer++;
}
