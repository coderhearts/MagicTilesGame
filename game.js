const NUM_COLUMNS = 4;
const TILE_HEIGHT = 60;
const COLUMN_HEIGHT = 400;
const TILE_SPEED_START = 2;
const SPEED_INCREMENT = 0.2;
const TILES_PER_LEVEL = 10;

let columns = [];
let tiles = [];
let score = 0;
let speed = TILE_SPEED_START;
let gameActive = true;
let animationFrame;

const columnsDiv = document.getElementById('columns');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

function setupColumns() {
    columnsDiv.innerHTML = '';
    columns = [];
    for (let i = 0; i < NUM_COLUMNS; i++) {
        const col = document.createElement('div');
        col.className = 'column';
        columnsDiv.appendChild(col);
        columns.push(col);
    }
}

function createTile(columnIndex, y) {
    const tile = document.createElement('div');
    tile.className = 'tile black';
    tile.style.top = y + 'px';
    tile.dataset.column = columnIndex;
    tile.addEventListener('click', () => handleTileClick(tile));
    columns[columnIndex].appendChild(tile);
    tiles.push({tile, columnIndex, y, active: true});
}

function spawnTiles() {
    // Only one black tile per row
    const blackCol = Math.floor(Math.random() * NUM_COLUMNS);
    for (let i = 0; i < NUM_COLUMNS; i++) {
        if (i === blackCol) {
            createTile(i, -TILE_HEIGHT);
        }
    }
}

function moveTiles() {
    for (let obj of tiles) {
        if (!obj.active) continue;
        obj.y += speed;
        obj.tile.style.top = obj.y + 'px';
        if (obj.y + TILE_HEIGHT >= COLUMN_HEIGHT) {
            // Missed tile
            endGame();
            return;
        }
    }
    // Remove tiles that are out of view
    tiles = tiles.filter(obj => obj.y < COLUMN_HEIGHT && obj.active);
}

function handleTileClick(tile) {
    if (!gameActive) return;
    tile.classList.add('inactive');
    tile.classList.remove('black');
    tile.style.background = '#0f0';
    score++;
    scoreDiv.textContent = 'Score: ' + score;
    // Mark as inactive
    const obj = tiles.find(t => t.tile === tile);
    if (obj) obj.active = false;
    // Increase speed every few tiles
    if (score % TILES_PER_LEVEL === 0) {
        speed += SPEED_INCREMENT;
    }
}

function endGame() {
    gameActive = false;
    cancelAnimationFrame(animationFrame);
    restartBtn.style.display = 'inline-block';
    for (let obj of tiles) {
        obj.tile.style.pointerEvents = 'none';
    }
    scoreDiv.textContent += ' | Game Over!';
}

function restartGame() {
    score = 0;
    speed = TILE_SPEED_START;
    gameActive = true;
    tiles.forEach(obj => obj.tile.remove());
    tiles = [];
    scoreDiv.textContent = 'Score: 0';
    restartBtn.style.display = 'none';
    setupColumns();
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;
    if (tiles.length === 0 || tiles[tiles.length - 1].y > TILE_HEIGHT * 2) {
        spawnTiles();
    }
    moveTiles();
    animationFrame = requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener('click', restartGame);

// Initialize game
setupColumns();
gameLoop();
