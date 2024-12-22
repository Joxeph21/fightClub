function pauseGame() {
  document.querySelector("#pause-menu").style.display = "flex";
  isPaused = true;
}

function continueGame() {
  document.querySelector("#pause-menu").style.display = "none";
  isPaused = false;
  decreaseTimer();
}

window.addEventListener("keydown", (e) => {
  if (isPaused && e.key === "Escape") {
    continueGame();
  } else if (e.key === "Escape" && !isPaused) {
    pauseGame();
  }
});

let timer = 99;
let timerId;
function decreaseTimer() {
  if (isPaused) {
    clearTimeout(timerId);
    return;
  }
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    checkWinner({ player: player.health, enemy: player2.health, timerId });
  }
}

function checkWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector("#result").style.display = "flex";
  
    if (player === enemy) {
      document.querySelector(".winner").innerHTML = "Tie";
    } else if (player > enemy) {
      document.querySelector(".winner").innerHTML = "Player 1 wins";
    } else if (player < enemy) {
      document.querySelector(".winner").innerHTML = "Enemy wins";
    }
    player.dead = true
    player2.dead = true
  }