const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreTieEl = document.getElementById("scoreTie");
const aiBtn = document.getElementById("aiBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let vsAI = false;
let scoreX = 0, scoreO = 0, scoreTie = 0;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8], 
  [0,3,6],[1,4,7],[2,5,8], 
  [0,4,8],[2,4,6]          
];

function startGame(aiMode) {
  vsAI = aiMode;
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  running = true;
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
    cell.addEventListener("click", cellClicked);
  });
}

function cellClicked() {
  const index = this.getAttribute("data-index");
  if (board[index] !== "" || !running) return;

  updateCell(this, index);
  checkWinner();

  if (running && vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}
function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("marked");
}
function changePlayer() {
  currentPlayer = (currentPlayer === "X") ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}
function checkWinner() {
  let roundWon = false;
  let winCombo = [];

  for (let condition of winConditions) {
    const [a,b,c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winCombo = condition;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    highlightWin(winCombo);
    updateScore(currentPlayer);
    running = false;
  } else if (!board.includes("")) {
    statusText.textContent = "🤝 It's a Tie!";
    scoreTie++;
    scoreTieEl.textContent = scoreTie;
    running = false;
  } else {
    changePlayer();
  }
}
function highlightWin(combo) {
  combo.forEach(i => cells[i].classList.add("win"));
}
function updateScore(winner) {
  if (winner === "X") {
    scoreX++;
    scoreXEl.textContent = scoreX;
  } else {
    scoreO++;
    scoreOEl.textContent = scoreO;
  }
}
function restartGame() {
  startGame(vsAI);
}
function aiMove() {
  let emptyCells = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const cell = document.querySelector(`.cell[data-index='${move}']`);
  updateCell(cell, move);
  checkWinner();
}
resetBtn.addEventListener("click", restartGame);
aiBtn.addEventListener("click", () => startGame(true));
twoPlayerBtn.addEventListener("click", () => startGame(false));
