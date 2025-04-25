const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreText = document.getElementById("finalScore");
const replayButton = document.getElementById("replayButton");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let bugs = [];
let gameRunning = true;

function createBug() {
  const bug = document.createElement("div");
  bug.classList.add("bug");
  bug.style.left = Math.random() * (window.innerWidth - 45) + "px";
  gameArea.appendChild(bug);
  bugs.push({ el: bug, top: 0 });
}

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
      gameOver(); // Use this to play sound consistently
    }

    if (bug.top > window.innerHeight) {
      gameArea.removeChild(bug.el);
      bugs.splice(index, 1);
      score++;
      scoreDisplay.textContent = "Score: " + score;
    }
  });
}

function gameOver() {
    // Reset the audio to the start
    gameOverSound.currentTime = 0;
  
    // Play the sound
    gameOverSound.play();
  }
  

function movePlayer(e) {
  const left = player.offsetLeft;
  const step = 100;
  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = left - step + "px";
  } else if (e.key === "ArrowRight" && left < window.innerWidth - 60) {
    player.style.left = left + step + "px";
  }
}

function resetGame() {
  // Reset values
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameRunning = true;

  // Remove bugs
  bugs.forEach((bug) => {
    if (bug.el && gameArea.contains(bug.el)) {
      gameArea.removeChild(bug.el);
    }
  });
  bugs = [];

  // Hide modal
  gameOverModal.classList.remove("show");

  // Reset player to center
  player.style.left = "50%";

  // Restart game loop
  gameLoop();
}

window.addEventListener("keydown", movePlayer);
replayButton.addEventListener("click", resetGame);

setInterval(() => {
  if (gameRunning) createBug();
}, 1000);

function gameLoop() {
  if (gameRunning) {
    updateBugs();
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();