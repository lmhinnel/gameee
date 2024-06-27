// vw->px: vw * windowWidth / 100 => px
const pieceSize = {
  size: 80,
  responsiveSize: 8,
};

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `.piece { width: ${pieceSize.size}px; height: ${pieceSize.size}px; border: 0.5px solid black; }\n`;
style.innerHTML += `@media only screen and (max-width: 600px) { .piece { width: ${pieceSize.responsiveSize}vw; height: ${pieceSize.responsiveSize}vw; } }`;
document.getElementsByTagName("head")[0].appendChild(style);

const convertVwToPx = (vw) => (vw * window.innerWidth) / 100;

const getCurrentPieceSize = () =>
  window.innerWidth > 600
    ? pieceSize.size
    : convertVwToPx(pieceSize.responsiveSize);
