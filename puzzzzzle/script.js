const gameForm = document.getElementById("gameForm");
const gameBoard = document.getElementById("gameBoard");
const helpMe = document.getElementById("helpMe");
const clock = document.getElementById("clock");
const CLLOCK = null;

const img = new Image();
img.onload = () => {
  GAME.image.width = img.width;
  GAME.image.height = img.height;
  GAME.image.size = img.width > img.height ? img.height : img.width;
  initial();
  shuffle();
  CLLOCK = createClock();
};

const GAME = {
  size: 3,
  image: {
    original: null,
    url: null,
    width: null,
    height: null,
    size: null,
  },
};

function initial() {
  // initial board
  gameBoard.innerHTML = "";
  for (let i = 0; i < GAME.size; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    var pSz = getCurrentPieceSize();
    for (let j = 0; j < GAME.size; j++) {
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.dataset.row = i;
      piece.dataset.col = j;
      piece.addEventListener("click", (e) => {
        swapEmptyPiece(e.target, i, j);
        if (checkWin()) {
          let ttime = parseInt(clock.innerHTML);
          setTimeout(() => {
            clearInterval(CLLOCK);
            alert(
              `Chỉ mất ${Math.floor(ttime / 60)}' ${
                ttime % 60
              }s, pro đã giải xong, đỉnh zữ!! _(:3 」∠)_`
            );
            clock.innerHTML = "0";
          }, 100);
        }
      });

      if (i == GAME.size - 1 && j == GAME.size - 1) {
        piece.style = "";
        piece.id = "nome";
      } else {
        piece.style.backgroundImage = `url(${GAME.image.url})`;
        piece.style.backgroundSize =
          GAME.image.width == GAME.image.size
            ? `${GAME.size * 100}% auto`
            : `auto ${GAME.size * 100}%`;
        piece.style.backgroundPosition = `-${j * pSz}px -${i * pSz}px`;
        piece.id = `${i}-${j}`;
      }

      row.appendChild(piece);
    }
    gameBoard.appendChild(row);
  }
}

// play button pressed
function playy(fromEvent) {
  fromEvent.preventDefault();

  // define
  const fromData = new FormData(fromEvent.target);
  const fromImg = fromData.get("gameImage");

  // validation
  if (!fromImg || !fromImg.size) {
    alert("Chọn ảnh ikkk!");
    return;
  }

  // get data
  GAME.size = parseInt(fromData.get("gameSize"));
  GAME.image = {
    original: fromImg,
    url: URL.createObjectURL(fromImg),
  };

  img.src = GAME.image.url;
}

function getRandomRelativePosition(row, col) {
  while (true) {
    let random = Math.floor(Math.random() * 4);
    switch (random) {
      case 0: // up
        if (row > 0) return { row: row - 1, col };
      case 1: // down
        if (row < GAME.size - 1) return { row: row + 1, col };
      case 2: // left
        if (col > 0) return { row, col: col - 1 };
      case 3: // right
        if (col < GAME.size - 1) return { row, col: col + 1 };
    }
  }
}

function shuffle() {
  const pieces = Array.from(document.querySelectorAll(".piece"));

  // test win
  swapPiece(pieces[pieces.length - 1], pieces[pieces.length - 2]);
  return;

  const matrix = Array.from(Array(GAME.size).keys()).map((i) =>
    Array.from(Array(GAME.size).keys()).map((j) => i * GAME.size + j)
  );
  let mtP = {
    row: GAME.size - 1,
    col: GAME.size - 1,
    value: Math.pow(GAME.size, GAME.size),
  };
  for (let i = 0; i < mtP.value; i++) {
    let swapP = getRandomRelativePosition(mtP.row, mtP.col);
    matrix[mtP.row][mtP.col] = matrix[swapP.row][swapP.col];
    matrix[swapP.row][swapP.col] = mtP.value;
    mtP.row = swapP.row;
    mtP.col = swapP.col;
  }

  const randomOrder = matrix.reduce((acc, cur) => acc.concat(cur), []);
  pieces.forEach((cur, index) => {
    swapPiece(cur, pieces[randomOrder[index]]);
  });
}

function swapEmptyPiece(cur, row, col) {
  var piecee;
  // up
  if (row > 0) {
    piecee = document.querySelector(
      `[data-row='${row - 1}'][data-col='${col}']`
    );
    piecee.id == "nome" ? swapPiece(cur, piecee) : null;
  }
  // down
  if (row < GAME.size - 1) {
    piecee = document.querySelector(
      `[data-row='${row + 1}'][data-col='${col}']`
    );
    piecee.id == "nome" ? swapPiece(cur, piecee) : null;
  }

  // left
  if (col > 0) {
    piecee = document.querySelector(
      `[data-row='${row}'][data-col='${col - 1}']`
    );
    piecee.id == "nome" ? swapPiece(cur, piecee) : null;
  }

  // right
  if (col < GAME.size - 1) {
    piecee = document.querySelector(
      `[data-row='${row}'][data-col='${col + 1}']`
    );
    piecee.id == "nome" ? swapPiece(cur, piecee) : null;
  }
}

function swapPiece(pA, pB) {
  const tempCur = {
    id: pA.id,
    style: {
      backgroundPosition: pA.style.backgroundPosition,
      backgroundImage: pA.style.backgroundImage,
      backgroundSize: pA.style.backgroundSize,
    },
  };
  pA.id = pB.id;
  pA.style.backgroundPosition = pB.style.backgroundPosition;
  pA.style.backgroundImage = pB.style.backgroundImage;
  pA.style.backgroundSize = pB.style.backgroundSize;
  pB.id = tempCur.id;
  pB.style.backgroundPosition = tempCur.style.backgroundPosition;
  pB.style.backgroundImage = tempCur.style.backgroundImage;
  pB.style.backgroundSize = tempCur.style.backgroundSize;
}

function checkWin() {
  const pieces = Array.from(document.querySelectorAll(".piece"));
  for (let i = 0; i < pieces.length; i++) {
    if (
      pieces[i].id != "nome" &&
      pieces[i].id != `${pieces[i].dataset.row}-${pieces[i].dataset.col}`
    )
      return false;
  }
  return true;
}

function helpMeImg() {
  let heheImg = document.createElement("div");
  heheImg.id = "heheImg";
  heheImg.style.backgroundImage = `url(${GAME.image.url})`;
  heheImg.style.height = GAME.size * (getCurrentPieceSize() + 0.5) + "px";
  heheImg.style.width = heheImg.style.height;

  let heheImgCover = document.createElement("div");
  heheImgCover.id = "heheImgCover";
  heheImgCover.appendChild(heheImg);

  heheImgCover.addEventListener("click", () => {
    if (document.getElementById("heheImgCover")) {
      document.getElementById("heheImgCover").remove();
    }
  });
  return heheImgCover;
}

helpMe.addEventListener("click", () => {
  if (!GAME.image.url) return alert("Hé hé");
  if (document.getElementById("heheImgCover")) {
    document.getElementById("heheImgCover").remove();
  } else {
    document.body.appendChild(helpMeImg());
  }
});

function createClock() {
  const time_interval = setInterval(() => {
    clock.innerHTML = parseInt(clock.innerHTML) + 1;
  }, 1000);
  return time_interval;
}
