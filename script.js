const GAME_TABLE_HEIGHT = 9;
const GAME_TABLE_WIDTH = 16;
const GAME_CARDS_PER_ASSET = 8;
const GAME_TIME_DISPLAY_LINE = 500;
const GAME_COUNTDOWN_TIME = 15 * 60; // seconds

var game_table = document.getElementById("game_table");
var shuffel_button = document.getElementById("shuffel_button");
var score = document.getElementById("score");
var time_content = document.getElementById("time_content");

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
// availabe ? array of points : null

// CHECK IN SAME ROW
const checkLineX = (table, p1, p2) => {
  var x = p1.x;
  var pMinY = p1.y > p2.y ? p2 : p1;
  var pMaxY = p1.y > p2.y ? p1 : p2;
  for (var y = pMinY.y + 1; y < pMaxY.y; y++) if (table[x][y] != 0) return null;
  return [pMinY, pMaxY];
};

// CHECK IN SAME COLUMN
const checkLineY = (table, p1, p2) => {
  var y = p1.y;
  var pMinX = p1.x > p2.x ? p2 : p1;
  var pMaxX = p1.x > p2.x ? p1 : p2;
  for (var x = pMinX.x + 1; x < pMaxX.x; x++) if (table[x][y] != 0) return null;
  return [pMinX, pMaxX];
};

// CHECK IN WIDTH >= HEIGHT RECTANGLE
const checkRectX = (table, p1, p2) => {
  if (p1.x == p2.x || p1.y == p2.y) return null;
  var ret = [];
  var pMinX = p1,
    pMaxX = p2;
  if (p1.x > p2.x) {
    pMinX = p2;
    pMaxX = p1;
  }
  var checking_col, type, minY, maxY;
  // checking_col from: 1 = left to right, -1 = right to left
  if (pMinX.y < pMaxX.y) {
    type = 1;
    minY = pMinX.y;
    maxY = pMaxX.y;
    checking_col = minY;
  } else {
    type = -1;
    minY = pMaxX.y;
    maxY = pMinX.y;
    checking_col = maxY;
  }
  while (minY <= checking_col && checking_col <= maxY) {
    const mid_point1 =
      checking_col == pMinX.y ? null : { x: pMinX.x, y: checking_col };
    const mid_point2 =
      checking_col == pMaxX.y ? null : { x: pMaxX.x, y: checking_col };

    if (
      (mid_point1 || mid_point2) &&
      (!mid_point1 ||
        (mid_point1 &&
          table[mid_point1.x][mid_point1.y] == 0 &&
          checkLineX(table, pMinX, mid_point1))) &&
      (!mid_point2 ||
        (mid_point2 &&
          table[mid_point2.x][mid_point2.y] == 0 &&
          checkLineX(table, mid_point2, pMaxX))) &&
      checkLineY(table, mid_point1 || pMinX, mid_point2 || pMaxX)
    ) {
      const arr =
        mid_point1 && mid_point2
          ? [pMinX, mid_point1, mid_point2, pMaxX]
          : mid_point1
          ? [pMinX, mid_point1, pMaxX]
          : mid_point2
          ? [pMinX, mid_point2, pMaxX]
          : [pMinX, pMaxX];
      const ret_length = ret.length;
      if (ret_length == 0 || ret_length > arr.length) ret = arr;
    }
    checking_col += type;
  }
  return ret.length > 0 ? ret : null;
};

// CHECK IN HEIGHT >= WIDTH RECTANGLE
const checkRectY = (table, p1, p2) => {
  if (p1.x == p2.x || p1.y == p2.y) return null;
  var ret = [];
  var pMinY = p1,
    pMaxY = p2;
  if (p1.y > p2.y) {
    pMinY = p2;
    pMaxY = p1;
  }
  var checking_row, type, minX, maxX;
  // checking_row from: 1 = bottom to top, -1 = top to bottom
  if (pMinY.x < pMaxY.x) {
    type = 1;
    minX = pMinY.x;
    maxX = pMaxY.x;
    checking_row = minX;
  } else {
    type = -1;
    minX = pMaxY.x;
    maxX = pMinY.x;
    checking_row = maxX;
  }

  while (minX <= checking_row && checking_row <= maxX) {
    const mid_point1 =
      checking_row == pMinY.x ? null : { x: checking_row, y: pMinY.y };
    const mid_point2 =
      checking_row == pMaxY.x ? null : { x: checking_row, y: pMaxY.y };

    if (
      (mid_point1 || mid_point2) &&
      (!mid_point1 ||
        (mid_point1 &&
          table[mid_point1.x][mid_point1.y] == 0 &&
          checkLineY(table, pMinY, mid_point1))) &&
      (!mid_point2 ||
        (mid_point2 &&
          table[mid_point2.x][mid_point2.y] == 0 &&
          checkLineY(table, mid_point2, pMaxY))) &&
      checkLineX(table, mid_point1 || pMinY, mid_point2 || pMaxY)
    ) {
      const arr =
        mid_point1 && mid_point2
          ? [pMinY, mid_point1, mid_point2, pMaxY]
          : mid_point1
          ? [pMinY, mid_point1, pMaxY]
          : mid_point2
          ? [pMinY, mid_point2, pMaxY]
          : [pMinY, pMaxY];
      const ret_length = ret.length;
      if (ret_length == 0 || ret_length > arr.length) ret = arr;
    }
    checking_row += type;
  }
  return ret.length > 0 ? ret : null;
};

// CHECK IN OPEN HEIGHT RECTANGLE
const checkMoreLineX = (table, p1, p2, type) => {
  if (p1.y == p2.y) return null;
  var pMinY = p1,
    pMaxY = p2;
  if (p1.y > p2.y) {
    pMinY = p2;
    pMaxY = p1;
  }
  var checking_row = pMinY.x < pMaxY.x ? pMinY.x : pMaxY.x;
  if (type == -1) checking_row = pMinY.x > pMaxY.x ? pMinY.x : pMaxY.x;
  checking_row += type;

  while (0 <= checking_row && checking_row <= GAME_TABLE_HEIGHT + 1) {
    const mid_point1 = { x: checking_row, y: pMinY.y };
    const mid_point2 = { x: checking_row, y: pMaxY.y };

    if (
      table[mid_point1.x][mid_point1.y] == 0 &&
      table[mid_point2.x][mid_point2.y] == 0 &&
      checkLineY(table, pMinY, mid_point1) &&
      checkLineX(table, mid_point1, mid_point2) &&
      checkLineY(table, mid_point2, pMaxY)
    )
      return [pMinY, mid_point1, mid_point2, pMaxY];
    checking_row += type;
  }
  return null;
};

// CHECK IN OPEN WIDTH RECTANGLE
const checkMoreLineY = (table, p1, p2, type) => {
  if (p1.x == p2.x) return null;
  var pMinX = p1,
    pMaxX = p2;
  if (p1.x > p2.x) {
    pMinX = p2;
    pMaxX = p1;
  }
  var checking_col = pMinX.y < pMaxX.y ? pMinX.y : pMaxX.y;
  if (type == -1) checking_col = pMinX.y > pMaxX.y ? pMinX.y : pMaxX.y;
  checking_col += type;

  while (0 <= checking_col && checking_col <= GAME_TABLE_WIDTH + 1) {
    const mid_point1 = { x: pMinX.x, y: checking_col };
    const mid_point2 = { x: pMaxX.x, y: checking_col };

    if (
      table[mid_point1.x][mid_point1.y] == 0 &&
      table[mid_point2.x][mid_point2.y] == 0 &&
      checkLineX(table, pMinX, mid_point1) &&
      checkLineY(table, mid_point1, mid_point2) &&
      checkLineX(table, mid_point2, pMaxX)
    )
      return [pMinX, mid_point1, mid_point2, pMaxX];
    checking_col += type;
  }
  return null;
};

const checkTwoPoint = (table, p1, p2) => {
  if (table[p1.x][p1.y] == table[p2.x][p2.y]) {
    // check in same row
    var check_row = p1.x == p2.x && checkLineX(table, p1, p2);
    if (check_row?.length > 0) return check_row;

    // check in same col
    var check_col = p1.y == p2.y && checkLineY(table, p1, p2);
    if (check_col?.length > 0) return check_col;

    // check in width >= height rectangle
    var check_rect_x = checkRectX(table, p1, p2);
    if (check_rect_x?.length > 0) return check_rect_x;

    // check in height >= width rectangle
    var check_rect_y = checkRectY(table, p1, p2);
    if (check_rect_y?.length > 0) return check_rect_y;

    // check in open height to top rectangle
    var check_more_line_x_1 = checkMoreLineX(table, p1, p2, 1);
    if (check_more_line_x_1?.length > 0) return check_more_line_x_1;

    // check in open height to bottom rectangle
    var check_more_line_x_2 = checkMoreLineX(table, p1, p2, -1);
    if (check_more_line_x_2?.length > 0) return check_more_line_x_2;

    // check in open width to right rectangle
    var check_more_line_y_1 = checkMoreLineY(table, p1, p2, 1);
    if (check_more_line_y_1?.length > 0) return check_more_line_y_1;

    // check in open width to left rectangle
    var check_more_line_y_2 = checkMoreLineY(table, p1, p2, -1);
    if (check_more_line_y_2?.length > 0) return check_more_line_y_2;
  }
  return null;
};

const checkValidateMove = (table, p1, p2) => {
  const POINT_1 = document.getElementById(`game_table_cell_${p1.x}_${p1.y}`);
  const POINT_2 = document.getElementById(`game_table_cell_${p2.x}_${p2.y}`);
  var roadConners = checkTwoPoint(table, p1, p2);
  var road = calculateRoad(roadConners);
  renderRoad(road);
  setTimeout(() => {
    if (road) {
      POINT_1.classList.add("game_table_hidden_cell");
      POINT_2.classList.add("game_table_hidden_cell");
      table[p1.x][p1.y] = 0;
      table[p2.x][p2.y] = 0;
      removeRenderRoad(road);
    }
    POINT_1.classList.remove("selected");
    POINT_2.classList.remove("selected");
    p1 = null;
    p2 = null;
    if (roadConners?.length > 0)
      score.textContent =
        parseInt(score.textContent) +
        Math.round(60 / (roadConners?.length - 1));
  }, GAME_TIME_DISPLAY_LINE);
};

const checkValidateGameTable = () => {};

// RENDER GAME
const getAssetCardURL = (card_id) => {
  var str = "" + card_id;
  var pad = "0000";
  var ans = pad.substring(0, pad.length - str.length) + str;
  return `./assets/cards/card_${ans}.png`;
};

const calculateRoad = (points = []) => {
  if (!points || points?.length < 2) return null;
  var road = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (p1.x == p2.x)
      if (p1.y < p2.y)
        for (let j = p1.y; j < p2.y; j++) road.push({ x: p1.x, y: j });
      else for (let j = p1.y; j > p2.y; j--) road.push({ x: p1.x, y: j });
    if (p1.y == p2.y)
      if (p1.x < p2.x)
        for (let j = p1.x; j < p2.x; j++) road.push({ x: j, y: p1.y });
      else for (let j = p1.x; j > p2.x; j--) road.push({ x: j, y: p1.y });
  }
  road.push(points[points.length - 1]);
  return road;
};

const renderRoad = (road = []) => {
  if (!road || road.length < 2) return;
  for (let i = 0; i < road.length - 1; i++) {
    const point1 = road[i];
    const point2 = road[i + 1];
    const road1 = document
      .getElementById(`game_table_cell_${point1.x}_${point1.y}`)
      .getElementsByClassName("game_table_cell_road")[0];
    const road2 = document
      .getElementById(`game_table_cell_${point2.x}_${point2.y}`)
      .getElementsByClassName("game_table_cell_road")[1];
    if (point1.x == point2.x) {
      if (point1.y < point2.y) {
        road1.classList.add("road_right");
        road2.classList.add("road_left");
      } else {
        road1.classList.add("road_left");
        road2.classList.add("road_right");
      }
    }
    if (point1.y == point2.y) {
      if (point1.x < point2.x) {
        road1.classList.add("road_bottom");
        road2.classList.add("road_top");
      } else {
        road1.classList.add("road_top");
        road2.classList.add("road_bottom");
      }
    }
  }
};

const removeRenderRoad = (road = []) => {
  for (let i = 0; i < road.length; i++) {
    const cell = document.getElementById(
      `game_table_cell_${road[i].x}_${road[i].y}`
    );
    const roads = cell.getElementsByClassName("game_table_cell_road");
    roads[0].classList.remove(
      "road_right",
      "road_left",
      "road_bottom",
      "road_top"
    );
    roads[1].classList.remove(
      "road_right",
      "road_left",
      "road_bottom",
      "road_top"
    );
  }
};

// MERGE GAME
document.onreadystatechange = function () {
  var p1 = null,
    p2 = null;

  if (document.readyState === "complete") {
    var GAME_TABLE = initialGameTable();
    var countdown_time = GAME_COUNTDOWN_TIME;
    for (let i = 0; i < GAME_TABLE_HEIGHT + 2; i++) {
      const row = document.createElement("div");
      row.className = "game_table_row";
      for (let j = 0; j < GAME_TABLE_WIDTH + 2; j++) {
        const cell = document.createElement("div");
        cell.id = `game_table_cell_${i}_${j}`;
        cell.className = "game_table_cell";
        const road1 = document.createElement("div"),
          road2 = document.createElement("div");
        road1.className = "game_table_cell_road";
        road2.className = "game_table_cell_road";
        cell.appendChild(road1);
        cell.appendChild(road2);
        if (
          i * j == 0 ||
          i == GAME_TABLE_HEIGHT + 1 ||
          j == GAME_TABLE_WIDTH + 1
        ) {
          cell.classList.add("game_table_hidden_cell");
        } else {
          const img = document.createElement("img");
          img.src = getAssetCardURL(GAME_TABLE[i][j]);
          img.id = `game_table_cell_${i}_${j}_img`;
          img.alt = "card_" + GAME_TABLE[i][j];
          cell.addEventListener("click", () => {
            if (GAME_TABLE[i][j] == 0) return;
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
              checkValidateMove(GAME_TABLE, p1, p2);
              p1 = null;
              p2 = null;
            }
          });
          cell.appendChild(img);
        }

        row.appendChild(cell);
      }
      game_table.appendChild(row);
    }

    // set countdonw time
    const time_interval = setInterval(() => {
      if (countdown_time > 0) {
        countdown_time--;
        time_content.style.width = `${
          Math.round((countdown_time / GAME_COUNTDOWN_TIME) * 10000) / 100
        }%`;
      } else {
        alert("GAME OVER");
        clearInterval(time_interval);
      }
    }, 500);

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

    game_table.style.display = "block";
  }
};
