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

// shuffe board
function shuffle() {
  const pieces = Array.from(document.querySelectorAll(".piece"));
  // optimize order
  const randomOrder = Array.from(Array(GAME.size * GAME.size).keys()).sort(
    () => 0.5 - Math.random()
  );
  console.log(randomOrder);
  pieces.forEach((cur, index) => {
    const replacePiece = pieces[randomOrder[index]];
    const tempCur = {
      id: cur.id,
      style: { backgroundPosition: cur.style.backgroundPosition },
    };
    cur.id = replacePiece.id;
    cur.style.backgroundPosition = replacePiece.style.backgroundPosition;
    replacePiece.id = tempCur.id;
    replacePiece.style.backgroundPosition = tempCur.style.backgroundPosition;
  });
}
