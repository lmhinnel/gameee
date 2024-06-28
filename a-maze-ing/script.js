const MAZE_SIZE = {
    MIN: 10,
    MAX: 100,
  },
  MAZE_STATUS = {
    NEW: "new",
    PLAYING: "playing",
    END: "end",
  };

const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

const mazeSize = document.getElementById("mazeSize"),
  generateButt = document.getElementById("generateButt"),
  mazeBoard = document.getElementById("mazeBoard"),
  helpMe = document.getElementById("helpMe");

const GAME = {
  size: 10,
  status: MAZE_STATUS.NEW,
};

const generateMaze = () => {
  GAME.size = mazeSize.value;
  GAME.status = MAZE_STATUS.PLAYING;
  mazeBoard.innerHTML = "";
  for (let i = 0; i < GAME.size; i++) {
    const row = document.createElement("div");
    row.className = "maze-row";
    for (let j = 0; j < GAME.size; j++) {
      const cell = document.createElement("div");
      cell.className = "maze-cell";
      cell.id = `x-${i}-${j}`;
      row.appendChild(cell);
    }
    mazeBoard.appendChild(row);
  }
};

const startHehe = () => {
  document.getElementById("x-0-0").style.borderTop = "1px solid white";
  document.getElementById(`x-${GAME.size - 1}-${GAME.size - 1}`).innerHTML =
    "<div id='me'></div>";
};

// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_implementation_(with_stack)
const alg1 = () => {
  const stack = [];
  const visited = new Set();
  const start = [0, 0];
  visited.add(start.join("-"));
  stack.push(start);

  while (stack.length > 0) {
    const current = stack.pop();
    const [x, y] = current;
    const unvisited = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(
      (n) =>
        0 <= n[0] &&
        0 <= n[1] &&
        n[0] < GAME.size &&
        n[1] < GAME.size &&
        !visited.has(n.join("-"))
    );
    if (unvisited.length === 0) continue;

    stack.push(current);
    const rand = unvisited[Math.floor(Math.random() * unvisited.length)];
    if (rand) {
      // up - down - left - right
      if (rand[0] === x - 1) {
        const wall = document.getElementById(`x-${x}-${y}`);
        wall.style.borderTop = "1px solid white";
      } else if (rand[0] === x + 1) {
        const wall = document.getElementById(`x-${x + 1}-${y}`);
        wall.style.borderTop = "1px solid white";
      } else if (rand[1] === y - 1) {
        const wall = document.getElementById(`x-${x}-${y}`);
        wall.style.borderLeft = "1px solid white";
      } else if (rand[1] === y + 1) {
        const wall = document.getElementById(`x-${x}-${y + 1}`);
        wall.style.borderLeft = "1px solid white";
      }

      visited.add(rand.join("-"));
      stack.push(rand);
    }
  }
};

const move = (direction) => {
  if (GAME.status !== MAZE_STATUS.PLAYING) return;
  const me = document.getElementById("me");
  let [x, y] = me.parentElement.id.split("-").slice(1);
  if (
    !ARROWS.includes(direction) ||
    (direction === "ArrowUp" &&
      (x === 0 ||
        document.getElementById(`x-${x--}-${y}`).style.borderTopColor !=
          "white")) ||
    (direction === "ArrowDown" &&
      (x++ === GAME.size - 1 ||
        document.getElementById(`x-${x}-${y}`).style.borderTopColor !=
          "white")) ||
    (direction === "ArrowLeft" &&
      (y === 0 ||
        document.getElementById(`x-${x}-${y--}`).style.borderLeftColor !=
          "white")) ||
    (direction === "ArrowRight" &&
      (y++ === GAME.size - 1 ||
        document.getElementById(`x-${x}-${y}`).style.borderLeftColor !=
          "white"))
  )
    return;

  if (x == -1 && y == 0 && direction === "ArrowUp") {
    GAME.status = MAZE_STATUS.END;
    alert("You won Teehee!");
    return;
  }

  me.parentElement.innerHTML = "";
  document.getElementById(`x-${x}-${y}`).innerHTML = "<div id='me'></div>";
};

generateButt.addEventListener("click", () => {
  if (mazeSize.value < MAZE_SIZE.MIN || mazeSize.value > MAZE_SIZE.MAX) {
    alert(`Ec o ec: ${MAZE_SIZE.MIN} <= maze size <= ${MAZE_SIZE.MAX}`);
    return;
  }
  generateMaze();
  alg1();
  startHehe();
});

helpMe.addEventListener("click", () => {});

document.body.addEventListener("keydown", function (event) {
  move(event.key);
});
