const isMobile = /Mobi/i.test(window.navigator.userAgent);

// Make the DIV element draggable:
dragElement(document.getElementById("movable"));

function dragElement(ele) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const header = document.getElementById(ele.id + "header");
  header
    ? isMobile
      ? (header.ontouchstart = dragMouseDown)
      : (header.onmousedown = dragMouseDown)
    : isMobile
    ? (ele.ontouchstart = dragMouseDown)
    : (ele.onmousedown = dragMouseDown);

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    isMobile
      ? (document.ontouchend = closeDragElement)
      : (document.onmouseup = closeDragElement);
    isMobile
      ? (document.ontouchmove = elementDrag)
      : (document.onmousemove = elementDrag);
  }

  function elementDrag(e) {
    e = e || window.event;
    isMobile ? null : e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    ele.style.top = ele.offsetTop - pos2 + "px";
    ele.style.left = ele.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    isMobile ? (document.ontouchend = null) : (document.onmouseup = null);
    isMobile ? (document.ontouchmove = null) : (document.onmousemove = null);
  }
}
