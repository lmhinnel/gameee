const DB_PATH = './public/db.txt';
const HIGHSCORE_PATH = './public/highScore.txt';
const TIME = 60;
var db = [],
    length = 0,
    randomNumber = 0,
    endGame = true;

var question = document.getElementById('question'),
    answer = document.getElementById('answer'),
    score = document.getElementById('score'),
    timer = document.getElementById('timer');

var endAnswer = document.getElementById('endAnswer'),
    endName = document.getElementById('endName'),
    endDiv = document.getElementById('endDiv');

// initial game
function readTextFile() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", DB_PATH, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                db = allText.split("\n");
                length = db.length - 1;
            }
        }
    }
    rawFile.send(null);
}
readTextFile();

// countdown
var timerInterval = null,
    timerNum = TIME;
var resetTimer = () => {
    timerNum = TIME;
    clearInterval(timerInterval);
}
var counter = function () {
    timer.innerHTML = timerNum;
    if (timerNum > 0) {
        timerNum--;
    } else end();
};

// create new question
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('/');
}
function randomNewWord() {
    randomNumber = Math.floor(Math.random() * length);
    var q = db[randomNumber];
    q = q.replace(/ /g, '');
    question.innerText = shuffle(q.split(''));
    resetTimer();
    timerInterval = setInterval(counter, 1000);
    // console.log(db[randomNumber]); 
    // Uncomment above line to console log answer
}

// check
function checkAnswer(e) {
    e.preventDefault();
    if (db[randomNumber] === answer.value) {
        answer.value = '';
        score.innerHTML++;
        randomNewWord();
    }
}

// save highscore
function submitHighscore(e) {
    e.preventDefault();
    window.confirm(`${endName.value}'s score is ${score.innerHTML}`)
    // var blob = new Blob([`${endName.value} - ${score}`],
    //     { type: "text/plain;charset=utf-8" });
    // console.log(blob);
    // saveAs(blob, HIGHSCORE_PATH);
}

function start() {
    endDiv.style.display = "none";
    endName.value = '';
    endGame = false;
    randomNewWord();
    answer.disabled = false;
    answer.value = '';
    score.innerHTML = 0;
}

function end() {
    endGame = true;
    resetTimer();
    answer.disabled = true;
    endAnswer.innerHTML = db[randomNumber];
    endDiv.style.display = "block";
}