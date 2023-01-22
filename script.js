const GAME_TABLE_HEIGHT = 9;
const GAME_TABLE_WIDTH = 16;
const GAME_CARDS_PER_ASSET = 8;
const GAME_TIME_DISPLAY_LINE = 500;

const TEST_TABLE = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

var game_table = document.getElementById("game_table");
var shuffel_button = document.getElementById("shuffel_button");

// LOGIC GAME

const shuffleHehe = (table, fill_array, new_game = true) => {
  return table.map((row, row_id) =>
    row_id == 0 || row_id == GAME_TABLE_HEIGHT + 1
      ? row
      : row.map((cell, col_id) => {
          if (
            col_id == 0 ||
            col_id == GAME_TABLE_WIDTH + 1 ||
            (!new_game && cell == 0)
          )
            return cell;
          const random_index = Math.floor(Math.random() * fill_array.length);
          var ret = fill_array.splice(random_index, 1)[0];
          return ret;
        })
  );
};

const getArrayFromTable = (table) => {
  const ret = [];
  table.map((row) => row.map((cell) => (cell != 0 ? ret.push(cell) : null)));
  return ret;
};

const initialGameTable = () => {
  const tbl = new Array(GAME_TABLE_HEIGHT + 2).fill(
    new Array(GAME_TABLE_WIDTH + 2).fill(0)
  );
  const fill_array = [];
  for (var j = 1; ; j++) {
    const tmp_arr = new Array(GAME_CARDS_PER_ASSET).fill(j);
    const left =
      GAME_TABLE_HEIGHT * GAME_TABLE_WIDTH - tmp_arr.length - fill_array.length;
    if (left >= 0) {
      fill_array.push(...tmp_arr);
    } else {
      fill_array.push(...tmp_arr.slice(0, left));
      break;
    }
  }
  return shuffleHehe(tbl, fill_array);
};

// CHECK AVAILABLE MOVE

// CHECK IN SAME ROW
const checkLineX = (table, p1, p2) => {
  var x = p1.x;
  var pMinY = p1.y > p2.y ? p2 : p1;
  var pMaxY = p1.y > p2.y ? p1 : p2;
  for (var y = pMinY.y + 1; y < pMaxY.y; y++)
    if (table[x][y] != 0) return false;
  return true;
};

// CHECK IN SAME COLUMN
const checkLineY = (table, p1, p2) => {
  var y = p1.y;
  var pMinX = p1.x > p2.x ? p2 : p1;
  var pMaxX = p1.x > p2.x ? p1 : p2;
  for (var x = pMinX.x + 1; x < pMaxX.x; x++)
    if (table[x][y] != 0) return false;
  return true;
};

const checkRectX = (table, p1, p2) => {
  var pMinY = p1,
    pMaxY = p2;
  if (p1.y > p2.y) {
    pMinY = p2;
    pMaxY = p1;
  }
  for (var y = pMinY.y; y <= pMaxY.y; y++) {
    if (y > pMinY.y && table[pMinY.x][y] != 0) return -1;
    if (
      (table[pMaxY.x][y] == 0 || y == pMaxY.y) &&
      checkLineY(table, pMinY, pMaxY) &&
      checkLineX(table, pMaxY, pMaxY)
    )
      return y;
  }
  return -1;
};

const checkRectY = (table, p1, p2) => {
  var pMinX = p1,
    pMaxX = p2;
  if (p1.x > p2.x) {
    pMinX = p2;
    pMaxX = p1;
  }
  for (var x = pMinX.x; x <= pMaxX.x; x++) {
    if (x > pMinX.x && table[x][pMinX.y] != 0) return -1;
    if (
      (table[x][pMaxX.y] == 0 || x == pMaxX.x) &&
      checkLineX(table, pMinX, pMaxX) &&
      checkLineY(table, pMaxX, pMaxX)
    )
      return x;
  }
  return -1;
};

const checkMoreLineY = (table, p1, p2, type) => {
  var pMinX = p1,
    pMaxX = p2;
  if (p1.x > p2.x) {
    pMinX = p2;
    pMaxX = p1;
  }
  var checking_col = pMinX.y < pMaxX.y ? pMinX.y : pMaxX.y;
  type == -1 ? (checking_col = pMinX.y > pMaxX.y ? pMinX.y : pMaxX.y) : null;

  while (0 <= checking_col && checking_col <= GAME_TABLE_WIDTH + 1) {
    const mid_point1 = { x: pMinX.x, y: checking_col };
    const mid_point2 =
      checking_col > pMaxX.y && type == 1
        ? { x: pMaxX.x, y: checking_col }
        : checking_col < pMaxX.y && type == -1
        ? { x: pMaxX.x, y: checking_col }
        : null;

    if (
      checkLineX(table, pMinX, mid_point1) &&
      table[mid_point1.x][mid_point1.y] == 0 &&
      ((mid_point2 == null && checkLineY(table, mid_point1, pMaxX)) ||
        (table[mid_point2.x][mid_point2.y] == 0 &&
          checkLineY(table, mid_point1, mid_point2) &&
          checkLineX(table, mid_point2, pMaxX)))
    )
      return checking_col;
    checking_col += type;
  }
  return -1;
};

const checkMoreLineX = (table, p1, p2, type) => {
  var pMinY = p1,
    pMaxY = p2;
  if (p1.y > p2.y) {
    pMinY = p2;
    pMaxY = p1;
  }
  var checking_row = pMinY.x < pMaxY.x ? pMinY.x : pMaxY.x;
  type == -1 ? (checking_row = pMinY.x > pMaxY.x ? pMinY.x : pMaxY.x) : null;

  while (0 <= checking_row && checking_row <= GAME_TABLE_HEIGHT + 1) {
    const mid_point1 = { x: checking_row, y: pMinY.y };
    const mid_point2 =
      checking_row > pMaxY.x && type == 1
        ? { x: checking_row, y: pMaxY.y }
        : checking_row < pMaxY.x && type == -1
        ? { x: checking_row, y: pMaxY.y }
        : null;

    if (
      checkLineY(table, pMinY, mid_point1) &&
      table[mid_point1.x][mid_point1.y] == 0 &&
      ((mid_point2 == null && checkLineX(table, mid_point1, pMaxY)) ||
        (table[mid_point2.x][mid_point2.y] == 0 &&
          checkLineX(table, mid_point1, mid_point2) &&
          checkLineY(table, mid_point2, pMaxY)))
    )
      return checking_row;
    checking_row += type;
  }
  return -1;
};

const checkTwoPoint = (table, p1, p2) => {
  if (table[p1.x][p1.y] == table[p2.x][p2.y]) {
    // Kiểm tra đường x
    if (p1.x == p2.x && checkLineX(table, p1, p2)) return 1;

    // Kiểm tra đường y
    if (p1.y == p2.y && checkLineY(table, p1, p2)) return 2;

    // Kiểm tra hình chữ nhật x
    if (checkRectX(table, p1, p2) != -1) return 3;

    // Kiểm tra hình chữ nhật y
    if (checkRectY(table, p1, p2) != -1) return 4;

    // Kiểm tra mở rộng phải
    if (checkMoreLineX(table, p1, p2, 1) != -1) return 5;

    // Kiểm tra mở rộng trái
    if (checkMoreLineX(table, p1, p2, -1) != -1) return 6;

    // Kiểm tra mở rộng dưới
    if (checkMoreLineY(table, p1, p2, 1) != -1) return 7;

    // Kiểm tra mở rộng trên
    if (checkMoreLineY(table, p1, p2, -1) != -1) return 8;
  }
  return -1;
};

const checkValidateGameTable = () => {};

// RENDER GAME
const getAssetCardURL = (card_id) => {
  var str = "" + card_id;
  var pad = "0000";
  var ans = pad.substring(0, pad.length - str.length) + str;
  return `./assets/cards/card_${ans}.png`;
};

// MERGE GAME
document.onreadystatechange = function () {
  var p1 = null,
    p2 = null;

  if (document.readyState === "complete") {
    var GAME_TABLE = initialGameTable();
    // var GAME_TABLE = [...TEST_TABLE];
    for (let i = 1; i <= GAME_TABLE_HEIGHT; i++) {
      const row = document.createElement("div");
      row.className = "game_table_row";
      for (let j = 1; j <= GAME_TABLE_WIDTH; j++) {
        const img = document.createElement("img");
        img.src = getAssetCardURL(GAME_TABLE[i][j]);
        img.id = `game_table_cell_${i}_${j}_img`;
        img.alt = "card_" + GAME_TABLE[i][j];

        const cell = document.createElement("div");
        cell.id = `game_table_cell_${i}_${j}`;
        cell.className = "game_table_cell";
        cell.addEventListener("click", () => {
          // GET SELECTED CELL
          if (cell.classList.contains("selected")) {
            cell.classList.remove("selected");
            p1 = null;
          } else {
            cell.classList.add("selected");
            if (!p1) {
              p1 = { x: i, y: j };
            } else if (!p2) {
              p2 = { x: i, y: j };
            }
          }

          // CHECK VALIDATE
          if (p1 && p2) {
            const POINT_1 = document.getElementById(
              `game_table_cell_${p1.x}_${p1.y}`
            );
            const POINT_2 = document.getElementById(
              `game_table_cell_${p2.x}_${p2.y}`
            );
            var validate_type = checkTwoPoint(GAME_TABLE, p1, p2);
            setTimeout(() => {
              if (validate_type != -1) {
                POINT_1.style.opacity = 0;
                POINT_2.style.opacity = 0;
                GAME_TABLE[p1.x][p1.y] = 0;
                GAME_TABLE[p2.x][p2.y] = 0;
              }
              POINT_1.classList.remove("selected");
              POINT_2.classList.remove("selected");
              p1 = null;
              p2 = null;
            }, GAME_TIME_DISPLAY_LINE);
          }
        });
        cell.appendChild(img);

        row.appendChild(cell);
      }
      game_table.appendChild(row);
    }
    game_table.style.display = "block";
    shuffel_button.addEventListener("click", () => {
      GAME_TABLE = shuffleHehe(
        GAME_TABLE,
        getArrayFromTable(GAME_TABLE),
        false
      );
      for (let i = 1; i <= GAME_TABLE_HEIGHT; i++) {
        for (let j = 1; j <= GAME_TABLE_WIDTH; j++) {
          document.getElementById(`game_table_cell_${i}_${j}_img`).src =
            getAssetCardURL(GAME_TABLE[i][j]);
        }
      }
    });
  }
};
