// Game Board Config
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
const GRID_SIZE = 8;
const TILE_SIZE = canvas.width / GRID_SIZE;

// Player Data
let playerGold = 1000;
let playerTerritory = 0;
let aiTerritory = 0;
let currentTurn = "player";
let aiDifficulty = "Medium"; // Default AI difficulty
let grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));

// Update UI
function updateUI() {
    document.getElementById("gold").textContent = `Gold: ${playerGold}`;
    document.getElementById("territory").textContent = `Territory: ${playerTerritory}%`;

    // Check win condition
    if (playerTerritory >= 50) {
        alert("Player Wins!");
        resetGame();
    } else if (aiTerritory >= 50) {
        alert("AI Wins!");
        resetGame();
    }
}

// Draw Game Board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            ctx.strokeStyle = "white";
            ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            if (grid[row][col] === "X") {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (grid[row][col] === "O") {
                ctx.fillStyle = "red";
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Handle Player Clicks
canvas.addEventListener("click", (event) => {
    if (currentTurn !== "player") return;

    let col = Math.floor(event.offsetX / TILE_SIZE);
    let row = Math.floor(event.offsetY / TILE_SIZE);

    if (grid[row][col] === null) {
        grid[row][col] = "X";
        playerTerritory += 1;
        playerGold += 10;
        updateUI();
        drawBoard();
        nextTurn();
    }
});

// Buy Units
function buyUnit(type) {
    const cost = { "soldier": 500, "tank": 1000, "defender": 750 }[type];

    if (playerGold >= cost) {
        playerGold -= cost;
        alert(`${type} purchased!`);
        updateUI();
    } else {
        alert("Not enough gold!");
    }
}

// AI Turn with Difficulty Levels
function aiTurn() {
    setTimeout(() => {
        let emptyCells = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }

        let move;
        if (emptyCells.length > 0) {
            if (aiDifficulty === "Easy") {
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            } else if (aiDifficulty === "Medium") {
                move = findBestMove(emptyCells);
            } else if (aiDifficulty === "Hard") {
                move = findSmartMove(emptyCells);
            }

            grid[move.row][move.col] = "O";
            aiTerritory += 1;
            updateUI();
            drawBoard();
            nextTurn();
        }
    }, 2000);
}

// Medium AI: Prioritizes center and expansion
function findBestMove(availableMoves) {
    return availableMoves.sort((a, b) => {
        const centerX = GRID_SIZE / 2;
        const centerY = GRID_SIZE / 2;
        const distA = Math.abs(a.row - centerY) + Math.abs(a.col - centerX);
        const distB = Math.abs(b.row - centerY) + Math.abs(b.col - centerX);
        return distA - distB;
    })[0];
}

// Hard AI: Prioritizes attacking player tiles
function findSmartMove(availableMoves) {
    let attackMoves = availableMoves.filter(m => hasPlayerNeighbor(m.row, m.col));
    return attackMoves.length > 0 ? attackMoves[0] : findBestMove(availableMoves);
}

// Check if a tile has a player neighbor
function hasPlayerNeighbor(row, col) {
    let directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
    return directions.some(([dx, dy]) => {
        let newRow = row + dx;
        let newCol = col + dy;
        return newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && grid[newRow][newCol] === "X";
    });
}

// Start the Game with Selected AI Difficulty
function startGame() {
    aiDifficulty = document.getElementById("difficulty").value;
    alert(`AI Difficulty set to: ${aiDifficulty}`);
    resetGame();
}

// Next Turn
function nextTurn() {
    currentTurn = currentTurn === "player" ? "ai" : "player";

    if (currentTurn === "ai") {
        aiTurn();
    }
}

// Reset Game
function resetGame() {
    playerGold = 1000;
    playerTerritory = 0;
    aiTerritory = 0;
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    drawBoard();
    updateUI();
}

// Initialize
drawBoard();
updateUI();
