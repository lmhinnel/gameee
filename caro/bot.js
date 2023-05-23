const checkWin = (BOARD, SIZE, role) => {
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE; j++)
      if (
        BOARD[i][j] === role &&
        (checkRow(BOARD, SIZE, i, j, role) ||
          checkCol(BOARD, SIZE, i, j, role) ||
          checkDiagonal(BOARD, SIZE, i, j, role))
      )
        return true;
  return false;
};

const checkRow = (BOARD, SIZE, i, j, role) => {
  let count = 0;
  for (let k = j; k < SIZE; k++) {
    if (BOARD[i][k] === role) count++;
    else break;
  }
  if (count === 5) return true;
  return false;
};

const checkCol = (BOARD, SIZE, i, j, role) => {
  let count = 0;
  for (let k = i; k < SIZE; k++) {
    if (BOARD[k][j] === role) count++;
    else break;
  }
  if (count === 5) return true;
  return false;
};

const checkDiagonal = (BOARD, SIZE, i, j, role) => {
  let count = 0;
  for (let k = i, l = j; k < SIZE && l < SIZE; k++, l++) {
    if (BOARD[k][l] === role) count++;
    else break;
  }
  if (count === 5) return true;
  count = 0;
  for (let k = i, l = j; k < SIZE && l >= 0; k++, l--) {
    if (BOARD[k][l] === role) count++;
    else break;
  }
  if (count === 5) return true;
  return false;
};

const checkDraw = (BOARD, SIZE) => {
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE; j++) if (BOARD[i][j] === " ") return false;
  return true;
};

const isEmpty = (board) => {
  let size = board.length;
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) if (board[i][j] === " ") return true;
  return false;
};

const getMove = (board = [], role = "o") => {
  if (isEmpty(board)) {
    return bestMove(board, role);
  }
  return null;
};

function is_in(board, y, x) {
  return 0 <= y < board.length && 0 <= x < board.length;
}

function march(board, y, x, dy, dx, length) {
  let yf = y + length * dy;
  let xf = x + length * dx;
  while (!is_in(board, yf, xf)) {
    yf -= dy;
    xf -= dx;
  }
  return yf, xf;
}

function score_ready(scorecol) {
  const sumcol = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, "-1": {} };
  for (key in scorecol) {
    for (score in scorecol[key]) {
      if (sumcol[score].contains(key)) sumcol[score][key] += 1;
      else sumcol[score][key] = 1;
    }
  }
  return sumcol;
}

function sum_sumcol_values(sumcol) {
  for (key in sumcol)
    if (key === 5) sumcol[5] = int(1 in sumcol[5].values());
    else sumcol[key] = sum(sumcol[key].values());
}

function score_of_list(lis, col) {
  let blank = lis.count(" ");
  let filled = lis.count(col);

  if (blank + filled < 5) return -1;
  else if (blank === 5) return 0;
  else return filled;
}

function row_to_list(board, y, x, dy, dx, yf, xf) {
  row = [];
  while (y != yf + dy || x != xf + dx) row.append(board[y][x]);
  y += dy;
  x += dx;
  return row;
}

function score_of_row(board, cordi, dy, dx, cordf, col) {
  colscores = [];
  y, (x = cordi);
  yf, (xf = cordf);
  row = row_to_list(board, y, x, dy, dx, yf, xf);
  for (start in range(len(row) - 4)) {
    score = score_of_list(row.slice[(start, start + 5)], col);
    colscores.append(score);
  }

  return colscores;
}

function score_of_col(board, col) {
  f = board.length;
  const scores = { "[0, 1]": [], "[-1, 1]": [], "[1, 0]": [], "[1, 1]": [] };
  for (start in range(board.length)) {
    scores["[0, 1]"].push(
      score_of_row(board, (start, 0), 0, 1, (start, f - 1), col)
    );
    scores["[1, 0]"].push(
      score_of_row(board, (0, start), 1, 0, (f - 1, start), col)
    );
    scores["[1, 1]"].push(
      score_of_row(board, (start, 0), 1, 1, (f - 1, f - 1 - start), col)
    );
    scores["[-1, 1]"].push(
      score_of_row(board, (start, 0), -1, 1, (0, start), col)
    );
    if (start + 1 < board.length) {
      scores[(1, 1)].push(
        score_of_row(board, (0, start + 1), 1, 1, (f - 2 - start, f - 1), col)
      );
      scores[(-1, 1)].push(
        score_of_row(board, (f - 1, start + 1), -1, 1, (start + 1, f - 1), col)
      );
    }
  }

  return score_ready(scores);
}

function score_of_col_one(board, col, y, x) {
  const scores = { "[0, 1]": [], "[-1, 1]": [], "[1, 0]": [], "[1, 1]": [] };
  scores["[0, 1]"].push(
    score_of_row(
      board,
      march(board, y, x, 0, -1, 4),
      0,
      1,
      march(board, y, x, 0, 1, 4),
      col
    )
  );
  scores["[1, 0]"].push(
    score_of_row(
      board,
      march(board, y, x, -1, 0, 4),
      1,
      0,
      march(board, y, x, 1, 0, 4),
      col
    )
  );
  scores["[1, 1]"].push(
    score_of_row(
      board,
      march(board, y, x, -1, -1, 4),
      1,
      1,
      march(board, y, x, 1, 1, 4),
      col
    )
  );
  scores["[-1, 1]"].push(
    score_of_row(
      board,
      march(board, y, x, -1, 1, 4),
      1,
      -1,
      march(board, y, x, 1, -1, 4),
      col
    )
  );
  return score_ready(scores);
}

function possible_moves(board) {
  const taken = [];
  const directions = [
    (0, 1),
    (0, -1),
    (1, 0),
    (-1, 0),
    (1, 1),
    (-1, -1),
    (-1, 1),
    (1, -1),
  ];
  const cord = {};

  for (i in range(board.length))
    for (j in range(board.length)) if (board[i][j] != " ") taken.append((i, j));

  for (direction in directions) {
    dy, (dx = direction);
    for (coord in taken) {
      y, (x = coord);
      for (length in [1, 2, 3, 4]) {
        move = march(board, y, x, dy, dx, length);
        if (!taken.includes(move) && !Object.keys(cord).includes(move))
          cord[move] = false;
      }
    }
  }
  return cord;
}

function TF34score(score3, score4) {
  for (key4 in score4)
    if (score4[key4] >= 1)
      for (key3 in score3) if (key3 != key4 && score3[key3] >= 2) return true;
  return false;
}

function stupid_score(board, col, anticol, y, x) {
  const M = 1000;
  let res = 0,
    adv = 0,
    dis = 0;

  // # tấn công
  board[y][x] = col;
  const sumcol = score_of_col_one(board, col, y, x);
  const a = winning_situation(sumcol);
  adv += a * M;
  sum_sumcol_values(sumcol);
  adv +=
    sumcol[-1] + sumcol[1] + 4 * sumcol[2] + 8 * sumcol[3] + 16 * sumcol[4];

  // # phòng thủ
  board[y][x] = anticol;
  const sumanticol = score_of_col_one(board, anticol, y, x);
  const d = winning_situation(sumanticol);
  dis += d * (M - 100);
  sum_sumcol_values(sumanticol);
  dis +=
    sumanticol[-1] +
    sumanticol[1] +
    4 * sumanticol[2] +
    8 * sumanticol[3] +
    16 * sumanticol[4];

  res = adv + dis;
  board[y][x] = " ";
  return res;
}

function winning_situation(sumcol) {
  if (sumcol[5].values().contains(1)) return 5;
  else if (
    sumcol[4].length >= 2 ||
    (sumcol[4].length >= 1 && max(sumcol[4].values()) >= 2)
  )
    return 4;
  else if (TF34score(sumcol[3], sumcol[4])) return 4;
  else {
    score3 = sorted(sumcol[3].values(), (reverse = true));
    if (score3.length >= 2 && score3[0] >= score3[1] >= 2) return 3;
  }
  return 0;
}

function bestMove(BOARD, SIZE) {
  let x = SIZE / 2,
    y = x;
  while (BOARD[x][y] != " ") {
    x = Math.floor(Math.random() * SIZE);
    y = Math.floor(Math.random() * SIZE);
  }
  return [x, y];
  let anticol = "";
  if (col === "o") anticol = "x";
  else anticol = "o";
  let sz = Math.round(board.length / 2);
  let movecol = [sz, sz];
  let maxscorecol = "";

  let moves = possible_moves(board);
  for (let move in moves) {
    let y = move[0];
    let x = move[1];
    if (maxscorecol === "") {
      scorecol = stupid_score(board, col, anticol, y, x);
      maxscorecol = scorecol;
      movecol = move;
    } else {
      scorecol = stupid_score(board, col, anticol, y, x);
      if (scorecol > maxscorecol) {
        maxscorecol = scorecol;
        movecol = move;
      }
    }
  }
  return movecol;
}
