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
        GAME.map[x][y].walls.top = false;
        GAME.map[x - 1][y].walls.bottom = false;
      } else if (rand[0] === x + 1) {
        GAME.map[x][y].walls.bottom = false;
        GAME.map[x + 1][y].walls.top = false;
      } else if (rand[1] === y - 1) {
        GAME.map[x][y].walls.left = false;
        GAME.map[x][y - 1].walls.right = false;
      } else if (rand[1] === y + 1) {
        GAME.map[x][y].walls.right = false;
        GAME.map[x][y + 1].walls.left = false;
      }

      visited.add(rand.join("-"));
      stack.push(rand);
    }
  }
};

// Manhattan Distance
const getH = (x, y) => {
  const goal = [GAME.size - 1, GAME.size - 1];
  return Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
};

const isValid = (x1, y1, x2, y2) => {
  return (
    0 <= x2 &&
    x2 < GAME.size &&
    0 <= y2 &&
    y2 < GAME.size &&
    ((x1 > x2 && y1 === y2 && !GAME.map[x1][y1].walls.top) ||
      (x1 < x2 && y1 === y2 && !GAME.map[x1][y1].walls.bottom) ||
      (x1 === x2 && y1 > y2 && !GAME.map[x1][y1].walls.left) ||
      (x1 === x2 && y1 < y2 && !GAME.map[x1][y1].walls.right))
  );
};

const directions = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
];

// https://www.geeksforgeeks.org/a-search-algorithm/
const sol1 = () => {
  const open = new PriorityQueue((a, b) => a[0] > b[0]);
  const closedList = new Set();
  open.push([0.0, [0, 0]]);

  while (!open.isEmpty()) {
    const c = open.pop()[1];
    closedList.add(c);

    for (dir of directions) {
      const newC = [c[0] + dir[0], c[1] + dir[1]];
      if (!isValid(c[0], c[1], newC[0], newC[1]) || closedList.has(newC))
        continue;

      if (newC[0] === GAME.size - 1 && newC[1] === GAME.size - 1) {
        GAME.map[newC[0]][newC[1]].parent = c;
        const path = [];
        let row = GAME.size - 1,
          col = GAME.size - 1;
        // while (row !== 0 || col !== 0) {
        while (
          GAME.map[row][col].parent[0] != row ||
          GAME.map[row][col].parent[1] != col
        ) {
          path.push([row, col]);
          const parent = GAME.map[row][col].parent;
          row = parent[0];
          col = parent[1];
        }
        path.push([0, 0]);
        return path.reverse();
      }

      const g = GAME.map[c[0]][c[1]].g++,
        h = getH(newC[0], newC[1]),
        f = g + h;

      if (
        (newC[0] != 0 || newC[1] != 0) &&
        (GAME.map[newC[0]][newC[1]].f == 0 || GAME.map[newC[0]][newC[1]].f > f)
      ) {
        GAME.map[newC[0]][newC[1]].f = f;
        GAME.map[newC[0]][newC[1]].g = g;
        GAME.map[newC[0]][newC[1]].h = h;
        GAME.map[newC[0]][newC[1]].parent = c;
        open.push([f, newC]);
      }
    }
  }
};
