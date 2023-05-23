// import { checkDraw, checkWin, bestMove } from "./bot.js";

const GAME_STATUS = {
  READY: "READY",
  PLAYING: "PLAYING",
  X: "WINNER X",
  O: "WINNER O",
  DRAW: "DRAW",
};

let STATUS = GAME_STATUS.READY;
let SIZE = 0;
let BOARD = null;
let sizeInput = document.getElementById("size"),
  menu = document.getElementById("menu"),
  game = document.getElementById("game");

const toggleGame = (status = null) => {
  if (status) STATUS = status;
  switch (STATUS) {
    case GAME_STATUS.READY:
      menu.style.display = "block";
      game.style.display = "none";
      game.innerHTML = "";
      break;
    case GAME_STATUS.PLAYING:
      initialGame();
      menu.style.display = "none";
      game.style.display = "block";
      break;
    case GAME_STATUS.X:
    case GAME_STATUS.O:
    case GAME_STATUS.DRAW:
      infromation();
      break;
  }
  return true;
};

const initialGame = () => {
  let board = document.createElement("div");
  board.id = "board";
  BOARD = new Array(SIZE).fill("").map(() => new Array(SIZE).fill(" "));
  for (let i = 0; i < SIZE; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < SIZE; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = "cell-" + i + "-" + j;
      row.appendChild(cell);

      // GAME LOOP
      cell.addEventListener("click", (e) => {
        handleMove(e);
      });
    }
    board.appendChild(row);
  }
  game.appendChild(board);
};

const createGame = (e) => {
  e.preventDefault();
  if (10 <= sizeInput.value && sizeInput.value <= 40) {
    SIZE = parseInt(sizeInput.value);
    sizeInput.value = "";
    toggleGame(GAME_STATUS.PLAYING);
  } else alert("Size must be between 10 and 40");
};

const handleMove = (e) => {
  if (STATUS !== GAME_STATUS.PLAYING) {
    infromation();
    return;
  }
  let [i, j] = e.target.id.split("-").slice(1);
  if (BOARD[i][j] !== " ") return;
  e.target.innerText = "x";
  BOARD[i][j] = "x";
  if (
    (checkWin(BOARD, SIZE, "x") && toggleGame(GAME_STATUS.X)) ||
    (checkDraw(BOARD, SIZE) && toggleGame(GAME_STATUS.DRAW))
  )
    return;
  let [x, y] = bestMove(BOARD, SIZE);
  BOARD[x][y] = "o";
  document.getElementById("cell-" + x + "-" + y).innerText = "o";
  if (
    (checkWin(BOARD, SIZE, "o") && toggleGame(GAME_STATUS.O)) ||
    (checkDraw(BOARD, SIZE) && toggleGame(GAME_STATUS.DRAW))
  )
    return;
};

const infromation = () => {
  setTimeout(() => {
    if (
      (STATUS === GAME_STATUS.O ||
        STATUS === GAME_STATUS.X ||
        STATUS === GAME_STATUS.DRAW) &&
      confirm(STATUS)
    )
      toggleGame(GAME_STATUS.READY);
  }, 100);
};
