const currentPlayer = 0;

function step(steps) {
  let player = players[this.currentPlayer];
  let playerElement = document.getElementById("player-" + player.id);

  player.position += steps;
  if (currentPlayer + 1 <= players.length()) {
    this.currentPlayer++;
  }
}

function generateFields() {
  let boardElement = document.getElementById("board");
  game.fields.forEach((field) => {
    let newField = document.createElement("div");

    if (field.event) {
      newField.setAttribute("class", `field event-${field.event}`);
    } else {
      newField.setAttribute("class", "field");
    }

    newField.style.left = `${field.x}px`;
    newField.style.top = `${field.y}px`;
    boardElement.appendChild(newField);
  });
}

function addPlayers() {
  let boardElement = document.getElementById("board");
  game.players.forEach((player, index) => {
    if (player.disabled) {
      return;
    }

    let newPlayer = document.createElement("img");
    newPlayer.setAttribute("src", `img/player_${player.color}.svg`);
    newPlayer.setAttribute("class", "player");
    newPlayer.setAttribute("id", `player-${index}`);
    boardElement.appendChild(newPlayer);
  });
}

addPlayers();
//generateFields();

function getActivePlayers() {
  let activePlayers = 0;
  game.players.forEach((player) => {
    if (!player.disabled) {
      activePlayers++;
    }
  });
}

function mainLoop() {
  for (let i = 0; i < activePlayers; i++) {}
}
