const MAZE_SIZE = {
    MIN: 10,
    MAX: 100,
  },
  MAZE_STATUS = {
    PLAYING: "playing",
    END: "end",
  };

const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

class cell {
  constructor() {
    this.f = 0; // f = g + h
    this.g = 0; // start -> cell
    this.h = 0; // cell -> end
    this.parent = [0, 0];
    this.walls = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    };
  }
}

const mazeSize = document.getElementById("mazeSize"),
  generateButt = document.getElementById("generateButt"),
  mazeBoard = document.getElementById("mazeBoard"),
  helpMe = document.getElementById("helpMe");

const GAME = {
  size: 10,
  status: MAZE_STATUS.END,
  map: [],
};

const generateMaze = () => {
  GAME.size = mazeSize.value;
  GAME.status = MAZE_STATUS.PLAYING;
  GAME.map = [];
  for (let i = 0; i < GAME.size; i++) {
    let row = [];
    for (let j = 0; j < GAME.size; j++) {
      row.push(new cell(i, j));
    }
    GAME.map.push(row);
  }
};

const drawMaze = () => {
  mazeBoard.innerHTML = "";
  for (let i = 0; i < GAME.size; i++) {
    const row = document.createElement("div");
    row.className = "maze-row";
    for (let j = 0; j < GAME.size; j++) {
      const cell = document.createElement("div");
      cell.className = "maze-cell";
      cell.id = `x-${i}-${j}`;
      if (!GAME.map[i][j].walls.top) cell.style.borderTopColor = "white";
      if (!GAME.map[i][j].walls.bottom) cell.style.borderBottomColor = "white";
      if (!GAME.map[i][j].walls.left) cell.style.borderLeftColor = "white";
      if (!GAME.map[i][j].walls.right) cell.style.borderRightColor = "white";
      row.appendChild(cell);
    }
    mazeBoard.appendChild(row);
  }
};

const startHehe = () => {
  document.getElementById("x-0-0").innerHTML = "<div id='me'></div>";
  document
    .getElementById(`x-${GAME.size - 1}-${GAME.size - 1}`)
    .classList.add("goal");
};

const endHehe = () => {
  if (!document.getElementById("me").parentElement.classList.contains("goal"))
    return;
  new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second wait
  setTimeout(function () {
    GAME.status = MAZE_STATUS.END;
    alert("You won Teehee!");
  }, 100);
};

const move = (direction) => {
  if (GAME.status !== MAZE_STATUS.PLAYING) return;
  const me = document.getElementById("me");
  let [x, y] = me.parentElement.id.split("-").slice(1);
  if (
    !ARROWS.includes(direction) ||
    (direction === "ArrowUp" && (x === 0 || GAME.map[x--][y].walls.top)) ||
    (direction === "ArrowDown" &&
      (x === GAME.size - 1 || GAME.map[x++][y].walls.bottom)) ||
    (direction === "ArrowLeft" && (y === 0 || GAME.map[x][y--].walls.left)) ||
    (direction === "ArrowRight" &&
      (y === GAME.size - 1 || GAME.map[x][y++].walls.right))
  )
    return;
  me.parentElement.innerHTML = "";
  document.getElementById(`x-${x}-${y}`).innerHTML = "<div id='me'></div>";
  endHehe();
};

generateButt.addEventListener("click", () => {
  if (mazeSize.value < MAZE_SIZE.MIN || mazeSize.value > MAZE_SIZE.MAX) {
    alert(`Ec o ec: ${MAZE_SIZE.MIN} <= maze size <= ${MAZE_SIZE.MAX}`);
    return;
  }
  generateMaze();
  alg1();
  drawMaze();
  startHehe();
});

helpMe.addEventListener("click", () => {
  if (GAME.status !== MAZE_STATUS.PLAYING) return;

  const aStar = sol1();
  if (!aStar) {
    return;
  }
  const bgIncrese = 0.5 / aStar.length;
  for (let i = 0; i < aStar.length; i++) {
    setTimeout(() => {
      const [x, y] = aStar[i];
      document.getElementById(
        `x-${x}-${y}`
      ).style.backgroundColor = `rgba(127, 127, 255, ${0.2 + bgIncrese * i})`;
    }, 100 * i);
  }
});

document.body.addEventListener("keydown", function (event) {
  move(event.key);
});
