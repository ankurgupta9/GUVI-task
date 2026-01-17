const gameBoard = document.getElementById("gameBoard");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const gameUI = document.getElementById("gameUI");
const startBtn = document.getElementById("startBtn");
const timeEl = document.getElementById("time");
const flipsEl = document.getElementById("flips");
const bestEl = document.getElementById("best");

const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝"];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let flips = 0;
let time = 0;
let timerInterval = null;

const TOTAL_TIME = 300; // 5 minutes in seconds

const timeLeftEl = document.getElementById("timeLeft");

let timeLeft = TOTAL_TIME;


// ---------- INIT GAME ----------
function initGame() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
  flips = 0;
  time = 0;
  timeLeft = TOTAL_TIME;

  flipsEl.textContent = flips;
  timeEl.textContent = time;
  updateTimeLeft();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    time++;
    timeLeft--;

    timeEl.textContent = time;
    updateTimeLeft();

    if (timeLeft <= 0) {
      endGame(false); // time up
    }
  }, 1000);

  cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  cards.forEach(symbol => {
    gameBoard.appendChild(createCard(symbol));
  });

  loadBestScore();
}


// ---------- CREATE CARD ----------
function createCard(symbol) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-face", "card-front");

  const back = document.createElement("div");
  back.classList.add("card-face", "card-back");
  back.textContent = symbol;

  cardInner.append(front, back);
  card.appendChild(cardInner);

  card.addEventListener("click", () => flipCard(card, symbol));
  return card;
}

// ---------- FLIP CARD ----------
function flipCard(card, symbol) {
  if (flippedCards.length === 2 || card.classList.contains("flip")) return;

  card.classList.add("flip");
  flippedCards.push({ card, symbol });

  if (flippedCards.length === 2) {
    flips++;
    flipsEl.textContent = flips;
    checkMatch();
  }
}

// ---------- CHECK MATCH ----------
function checkMatch() {
  const [first, second] = flippedCards;

  if (first.symbol === second.symbol) {
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === symbols.length) {
      endGame(true);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
      flippedCards = [];
    }, 800);
  }
}

function updateTimeLeft() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = 
    `${minutes}:${seconds.toString().padStart(2, "0")}`;
}


// ---------- END GAME ----------
function endGame(won = true) {
  clearInterval(timerInterval);

  if (won) {
    saveBestScore();
    setTimeout(() => {
      alert(`🎉 Completed in ${time}s with ${flips} flips!`);
    }, 300);
  } else {
    setTimeout(() => {
      alert("⏰ Time’s up! Try again.");
    }, 300);
  }
}


// ---------- BEST SCORE ----------
function saveBestScore() {
  const best = JSON.parse(localStorage.getItem("bestScore"));

  if (
    !best ||
    time < best.time ||
    (time === best.time && flips < best.flips)
  ) {
    localStorage.setItem(
      "bestScore",
      JSON.stringify({ time, flips })
    );
  }

  loadBestScore();
}

function loadBestScore() {
  const best = JSON.parse(localStorage.getItem("bestScore"));
  if (best) {
    bestEl.textContent = `${best.time}s / ${best.flips} flips`;
  }
}

// ---------- RESTART ----------
restartBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  initGame();
});


// ---------- START ----------
startBtn.addEventListener("click", startGame);

function startGame() {
  startScreen.classList.add("hidden");
  gameUI.classList.remove("hidden");
  initGame(); // timer starts ONLY here
}

