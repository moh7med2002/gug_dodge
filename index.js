const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreText = document.getElementById("finalScore");
const replayButton = document.getElementById("replayButton");
const gameOverSound = document.getElementById("gameOverSound");
const mobileWarning = document.getElementById("mobileWarning");

let score = 0;
let bugs = [];
let gameRunning = true;

// Function to detect if the screen size is mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Show or hide the mobile warning and stop the game if mobile
function handleMobileWarning() {
  if (isMobile()) {
    mobileWarning.style.display = 'flex';
    gameRunning = false; // Stop the game from running
  } else {
    mobileWarning.style.display = 'none';
    gameRunning = true; // Allow the game to run
    gameLoop(); // Start the game loop if it's not mobile
  }
}

// Function to create a bug
function createBug() {
  const bug1 = document.createElement("div");
  bug1.classList.add("bug");
  bug1.style.left = Math.random() * (window.innerWidth - 45) + "px";
  gameArea.appendChild(bug1);
  bugs.push({ el: bug1, top: 0 });

  const bug2 = document.createElement("div");
  bug2.classList.add("bug");
  bug2.style.left = Math.random() * (window.innerWidth - 45) + "px";
  gameArea.appendChild(bug2);
  bugs.push({ el: bug2, top: 0 });
}

// Update bugs' positions and check for collisions
function updateBugs() {
  bugs.forEach((bug, index) => {
    bug.top += 5;
    bug.el.style.top = bug.top + "px";

    const bugRect = bug.el.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      bugRect.bottom > playerRect.top &&
      bugRect.left < playerRect.right &&
      bugRect.right > playerRect.left
    ) {
      gameRunning = false;
      finalScoreText.textContent = `Your final score is ${score}`;
      gameOverModal.classList.add("show");
      gameOver();
    }

    if (bug.top > window.innerHeight) {
      gameArea.removeChild(bug.el);
      bugs.splice(index, 1);
      score++;
      scoreDisplay.textContent = "Score: " + score;
    }
  });
}

// Play game over sound
function gameOver() {
  gameOverSound.currentTime = 0;
  gameOverSound.play();
}

// Move player with arrow keys
function movePlayer(e) {
  const left = player.offsetLeft;
  const step = 100;
  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = left - step + "px";
  } else if (e.key === "ArrowRight" && left < window.innerWidth - 60) {
    player.style.left = left + step + "px";
  }
}

// Reset the game to the initial state
function resetGame() {
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameRunning = true;

  bugs.forEach((bug) => {
    if (bug.el && gameArea.contains(bug.el)) {
      gameArea.removeChild(bug.el);
    }
  });
  bugs = [];

  gameOverModal.classList.remove("show");
  player.style.left = "50%";

  gameLoop();
}

// Listen for the replay button click
replayButton.addEventListener("click", resetGame);

// Check if the screen size is mobile on load and resize
window.addEventListener("load", handleMobileWarning);
window.addEventListener("resize", handleMobileWarning);

// Start creating bugs at intervals (two bugs at once)
setInterval(() => {
  if (gameRunning) createBug();
}, 1000);

// Main game loop
function gameLoop() {
  if (gameRunning) {
    updateBugs();
    requestAnimationFrame(gameLoop);
  }
}

// Start the game loop if it's not mobile
if (!isMobile()) {
  gameLoop();
}

// Listen for player movements
window.addEventListener("keydown", movePlayer);
