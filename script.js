const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const cellSize = 40;
let cols, rows;
let maze = [];
let player = { x: 0, y: 0 };

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function resizeCanvas() {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  generateMaze();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function generateMaze() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  function carve(x, y) {
    maze[y][x] = 0;
    let dirs = DIRS.sort(() => Math.random() - 0.5);
    for (let [dx, dy] of dirs) {
      let nx = x + dx * 2;
      let ny = y + dy * 2;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 1) {
        maze[y + dy][x + dx] = 0; 
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);
  maze[0][0] = 0; 
  maze[rows - 1][cols - 1] = 0;
  player = { x: 0, y: 0 };
  drawMaze();
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = maze[y][x] === 1 ? "#555" : "#111";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
  ctx.fillStyle = "#0f0";
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    (cols - 1) * cellSize,
    (rows - 1) * cellSize,
    cellSize,
    cellSize
  );
}

function movePlayer(dx, dy) {
  let nx = player.x + dx;
  let ny = player.y + dy;
  if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    drawMaze();
    if (player.x === cols - 1 && player.y === rows - 1) {
      alert("YOU WIN! 🎉");
      generateMaze();
    }
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      movePlayer(1, 0);
      break;
  }
});

let startX, startY;
canvas.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", (e) => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy))
    dx > 0 ? movePlayer(1, 0) : movePlayer(-1, 0);
  else dy > 0 ? movePlayer(0, 1) : movePlayer(0, -1);
});
