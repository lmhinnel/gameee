const factTitle = document.getElementById("fact_title");
const factContainer = document.getElementById("fact_container");
const factContent = document.getElementById("fact_content");
const factImg = document.getElementById("fact_img");
const userHoroscope = document.getElementById("horoscope");

var user = {
  birthday: null,
  horoscope: "",
};

function generateListHoroscope() {
  let listHoroscope = "";
  Object.keys(HOROSCOPE_DATA).forEach((sign) => {
    listHoroscope += `<option value="${sign}">${HOROSCOPE_DATA[sign].emoji} ${HOROSCOPE_DATA[sign].vn_name} (${HOROSCOPE_DATA[sign].name})</option>`;
  });
  document.getElementById("horoscope").innerHTML = listHoroscope;
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    generateListHoroscope();
  }
};

function getHoroscope(birthday) {
  birthday = new Date(birthday);
  const userMonth = birthday.getMonth() + 1;
  const userDay = birthday.getDate();
  Object.keys(HOROSCOPE_DATA).forEach((sign) => {
    const signData = HOROSCOPE_DATA[sign];
    const fromMonth = signData.date.form.month;
    const fromDay = signData.date.form.day;
    const toMonth = signData.date.to.month;
    const toDay = signData.date.to.day;
    if (
      (userMonth == fromMonth && fromDay <= userDay) ||
      (userMonth == toMonth && userDay <= toDay)
    )
      userHoroscope.value = sign;
  });
}

function removeBd() {
  document.getElementById("birthday").value = "";
}

function getUserData(fromEvent) {
  const userData = new FormData(fromEvent.target);
  const bd = userData.get("birthday");
  if (bd != "") user.birthday = new Date(bd);
  else user.birthday = null;
  user.horoscope = HOROSCOPE_DATA[userData.get("horoscope")];
  const zDetail = user.horoscope;
  var factDisplay = "";
  if (user.birthday != null) {
    factDisplay =
      "Xing vào " +
      user.birthday.toLocaleString("vi-VN", {
        dateStyle: "full",
        timeZone: "Asia/Ho_Chi_Minh",
      }) +
      ".<br />";
  }
  factDisplay += `Cung hoàng đạo nà: ${zDetail.emoji} ${zDetail.vn_name} (${zDetail.name}).\n`;
  factTitle.innerHTML = factDisplay;
}

function getUserFact(z) {
  const filePath = `./fact/${z.code}.json`;
  fetch(filePath)
    .then((Response) => Response.json())
    .then((data) => {
      const rd = Math.floor(Math.random() * Object.keys(data).length) + 1;
      const randomFact = data[rd];
      factContent.innerHTML = `"${randomFact}"`;
      factContainer.style.backgroundImage = `url(./assets/z-${z.code}.png)`;
      factImg.style.backgroundImage = `url(./assets/${z.code}.png)`;
    })
    .catch((err) => {
      console.log(err);
      factContent.innerHTML = "HEHE";
    });
}

function getFact(fromEvent) {
  fromEvent.preventDefault();
  getUserData(fromEvent);
  getUserFact(user.horoscope);
}

function getOnlineFact(fromEvent) {
  fromEvent.preventDefault();
  getUserData(fromEvent);
}
