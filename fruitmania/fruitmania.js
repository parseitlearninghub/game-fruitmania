var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
  // setGame();
  document.getElementById("board").style.display = "none";
  document
    .getElementById("start-game-btn")
    .addEventListener("click", startGame);
  document.getElementById("exit-game-btn").addEventListener("click", exitGame);
  document
    .getElementById("restart-game-btn")
    .addEventListener("click", restartGame);
};
function startGame() {
  // Hide the start button and show the board
  document.getElementById("start-game-btn").style.display = "none";
  document.getElementById("board").style.display = "flex";
  document.getElementById("exit-game-btn").style.display = "flex";
  document.getElementById("display-score").style.display = "block";
  document.getElementById("main-container").style.backgroundImage =
    "url('./img/bgstart.jfif')";

  // Initialize the game
  score = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("home_btn").style.display = "none";
  document.getElementById("leaderboard").style.display = "none";
  highscore.style.display = "none";
  bclick = 1;
  setGame();
}
function exitGame() {
  // Hide the popup and show the start button
  document.getElementById("start-game-btn").style.display = "inline-block";
  document.getElementById("board").style.display = "none";
  document.getElementById("game-over-popup").style.display = "none";
  document.getElementById("exit-game-btn").style.display = "none";
  document.getElementById("display-score").style.display = "none";
  document.getElementById("home_btn").style.display = "flex";
  document.getElementById("main-container").style.backgroundImage =
    "url('./img/bg4.jfif')";
  document.getElementById("leaderboard").style.display = "block";
}

function restartGame() {
  // Hide the popup and show the start button
  document.getElementById("game-over-popup").style.display = "none";
  score = 0;
  document.getElementById("score").innerText = score;
  setGame();
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  document.getElementById("board").innerHTML = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  //create 2 to begin the game
  setNumber(2);
  setNumber(2);
}

function checkGameOver() {
  if (!hasEmptyTile() && !canMerge()) {
    document.getElementById("game-over-popup").style.display = "block";
    console.log("Game Over");
    console.log("Score: ", score);
    //datebase
    this.localStorage.setItem("score", score);
  }
}
function canMerge() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) return true; // Check horizontally
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) return true; // Check vertically
    }
  }
  return false;
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = ""; //clear the classList
  tile.classList.add("tile");
  if (num > 0) {
    // tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
    let randomNumber = Math.random() < 0.2 ? 4 : 2;
    setNumber(randomNumber);
  } else if (e.code == "ArrowRight") {
    slideRight();
    let randomNumber = Math.random() < 0.2 ? 4 : 2;
    setNumber(randomNumber);
  } else if (e.code == "ArrowUp") {
    slideUp();
    let randomNumber = Math.random() < 0.2 ? 4 : 2;
    setNumber(randomNumber);
  } else if (e.code == "ArrowDown") {
    slideDown();
    let randomNumber = Math.random() < 0.2 ? 4 : 2;
    setNumber(randomNumber);
  }
  document.getElementById("score").innerText = score;
  document.getElementById("score-gameover").innerText = score;

  checkGameOver();
});
// Handle touch events (mobile devices)
document.addEventListener("touchstart", (e) => {
  // Get the initial touch coordinates
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
const SWIPE_THRESHOLD = 30;

document.addEventListener("touchend", (e) => {
  // Get the final touch coordinates
  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  // Calculate the difference in position
  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  // Determine the swipe direction
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
    // Horizontal swipe (left or right)
    if (diffX > 0) {
      // Swipe Right
      slideRight();
    } else {
      // Swipe Left
      slideLeft();
    }
  } else if (Math.abs(diffY) > SWIPE_THRESHOLD) {
    // Vertical swipe (up or down)
    if (diffY > 0) {
      // Swipe Down
      slideDown();
    } else {
      // Swipe Up
      slideUp();
    }
  }
  if (Math.abs(diffX) < SWIPE_THRESHOLD && Math.abs(diffY) < SWIPE_THRESHOLD) {
    return;
  }
  // After swipe, add a new tile
  let randomNumber = Math.random() < 0.2 ? 4 : 2;
  setNumber(randomNumber);

  // Update the score
  document.getElementById("score").innerText = score;
  document.getElementById("score-gameover").innerText = score;

  // Check for game over
  checkGameOver();
});

// Prevent default behavior for touch events
document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // Prevent scrolling or zooming
  },
  { passive: false }
);

function filterZero(row) {
  return row.filter((num) => num != 0); //create new array of all nums != 0
}

function slide(row) {
  //[0, 2, 2, 2]
  row = filterZero(row); //[2, 2, 2]
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  } //[4, 0, 2]
  row = filterZero(row); //[4, 2]
  //add zeroes
  while (row.length < columns) {
    row.push(0);
  } //[4, 2, 0, 0]
  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r]; //[0, 2, 2, 2]
    row.reverse(); //[2, 2, 2, 0]
    row = slide(row); //[4, 2, 0, 0]
    board[r] = row.reverse(); //[0, 0, 2, 4];
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function setNumber(number) {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    //find random row and column to place a 2 in
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = number;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = number.toString();
      tile.classList.add("x" + number.toString());
      found = true;
    }
  }
}

function hasEmptyTile() {
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        //at least one zero in the board
        return true;
      }
    }
  }
  return false;
}

//leaderboard
const highscore = document.querySelector(".highscore-container");
let bclick = 1;
function viewLeaderboard() {
  if (bclick == 1) {
    highscore.style.display = "flex";
    bclick = 2;
  } else if (bclick == 2) {
    highscore.style.display = "none";
    bclick = 1;
  }
}
