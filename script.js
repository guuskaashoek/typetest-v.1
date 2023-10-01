const keys = [..."abcdefghijklmnopqrstuvwxyz1234567890"];
const timestamps = [];

timestamps.unshift(getTimestamp());
let score = 0;
let highscore = 0; // Voeg de highscore-variabele toe en initialiseer deze met 0
let timer;
let timerRunning = false;

// Functie om de highscore uit de localStorage te halen bij het laden van de pagina
function loadHighscore() {
  const storedHighscore = localStorage.getItem("highscore");
  if (storedHighscore) {
    highscore = parseInt(storedHighscore);
    updateHighscore();
  }
}

// Functie om de highscore in de localStorage op te slaan
function saveHighscore() {
  localStorage.setItem("highscore", highscore.toString());
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomKey() {
  return keys[getRandomNumber(0, keys.length-1)];
}

function targetRandomKey() {
  const key = document.getElementById(getRandomKey());
  key.classList.add("selected");
  let start = Date.now();
}

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function startGame() {
  if (timerRunning) return; // Don't start a new game if one is already running
  score = 0;
  updateScore();
  timer = 30;
  updateTimer();
  timerRunning = true;
  targetRandomKey();

  const countdown = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearInterval(countdown);
      timerRunning = false;
      
      // Voeg code toe om de highscore bij te werken als nodig
      if (score > highscore) {
        highscore = score;
        updateHighscore();
        saveHighscore(); // Sla de highscore op in de localStorage
      }
    }
  }, 1000);
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Score: ${score}`;
}

function updateHighscore() {
  const highscoreElement = document.getElementById("highscore");
  highscoreElement.textContent = `Highscore: ${highscore}`;
}

function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time: ${timer}s`;
}

document.addEventListener("keyup", event => {
  if (!timerRunning) return; // Ignore key presses if the game is not running
  
  const keyPressed = event.key;
  const keyElement = document.getElementById(keyPressed);
  const highlightedKey = document.querySelector(".selected");
  
  keyElement.classList.add("hit");
  keyElement.addEventListener('animationend', () => {
    keyElement.classList.remove("hit");
  });
  
  if (keyPressed === highlightedKey.innerHTML) {
    timestamps.unshift(getTimestamp());
    const elapsedTime = timestamps[0] - timestamps[1];
    console.log(`Character per minute ${30/elapsedTime}`);
    highlightedKey.classList.remove("selected");
    targetRandomKey();
    score++;
    updateScore();
  } else {
    score--;
    updateScore();
  }
});

const refreshButton = document.getElementById('refresh-button'); // Selecteer de "Refresh" knop

refreshButton.addEventListener('click', () => {
  location.reload(); // Deze code laadt de pagina opnieuw
});

// Bel de functie om de highscore bij het laden van de pagina te laden
loadHighscore();

// Start het spel zodra de pagina is geladen
window.onload = startGame;
