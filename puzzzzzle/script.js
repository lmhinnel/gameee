const gameForm = document.getElementById("gameForm");
const gameBoard = document.getElementById("gameBoard");

const img = new Image();
img.onload = () => {
  GAME.image.width = img.width;
  GAME.image.height = img.height;
  GAME.image.size = img.width > img.height ? img.height : img.width;
  initial();
  shuffle();
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
        checkWin();
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

  // set image => initial img.onload
  img.src = GAME.image.url;
}

function shuffle() {
  const pieces = Array.from(document.querySelectorAll(".piece"));
  // optimize order
  const randomOrder = Array.from(Array(GAME.size * GAME.size).keys()).sort(
    () => 0.5 - Math.random()
  );
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
  var win = true;
  for (piecee in Array.from(document.querySelectorAll(".piece"))) {
    if (piecee.id != `${piecee.dataset.row}-${piecee.dataset.col}`) {
      win = false;
      break;
    }
  }

  if (win) {
    alert("You win!");
  }
}
