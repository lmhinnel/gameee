const gameForm = document.getElementById("gameForm");
const test = document.getElementById("test");
const GAME = {
  size: 3,
  image: "",
};

function playy(fromEvent) {
  fromEvent.preventDefault();
  const fromData = new FormData(fromEvent.target);
  GAME.size = fromData.get("gameSize");
  GAME.image = fromData.get("gameImage");
  test.style.backgroundImage = `url(${URL.createObjectURL(GAME.image)})`;
}
