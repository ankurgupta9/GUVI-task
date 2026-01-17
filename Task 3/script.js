const gameBoard = document.getElementById("gameBoard");
const restartBtn = document.getElementById("restartBtn");

const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝"];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Initialize game
function initGame() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;

  // Duplicate and shuffle cards
  cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

  cards.forEach(symbol => {
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  });
}

// Create card element
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

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);

  card.addEventListener("click", () => flipCard(card, symbol));
  return card;
}

// Flip logic
function flipCard(card, symbol) {
  if (flippedCards.length === 2 || card.classList.contains("flip")) return;

  card.classList.add("flip");
  flippedCards.push({ card, symbol });

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Check for match
function checkMatch() {
  const [first, second] = flippedCards;

  if (first.symbol === second.symbol) {
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === symbols.length) {
      setTimeout(() => alert("🎉 You won the game!"), 300);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
      flippedCards = [];
    }, 800);
  }
}

// Restart game
restartBtn.addEventListener("click", initGame);

// Start game
initGame();
