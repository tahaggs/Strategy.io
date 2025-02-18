const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

// Game Variables
let materials = 100;
let units = 0;
let controlledArea = 0;
let barracks = [];
let caves = [{ x: 100, y: 200 }, { x: 400, y: 300 }, { x: 600, y: 150 }];
let playerTurn = true;
let territories = [];
let aiTerritories = [];
let aiStrategy = ["aggressive", "defensive", "balanced"][Math.floor(Math.random() * 3)];

// UI Elements
const materialsUI = document.getElementById("materials");
const unitsUI = document.getElementById("units");
const areaUI = document.getElementById("area");

// Territory Class
class Territory {
    constructor(x, y, owner) {
        this.x = x;
        this.y = y;
        this.size = 80;
        this.owner = owner;
        this.units = Math.floor(Math.random() * 5) + 1;
    }

    draw() {
        ctx.fillStyle = this.owner === "player" ? "blue" : "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = "white";
        ctx.fillText(this.units, this.x + 30, this.y + 45);
    }
}

// Initialize Territories
for (let i = 0; i < 5; i++) {
    territories.push(new Territory(100 + i * 120, 100, "player"));
    aiTerritories.push(new Territory(100 + i * 120, 300, "AI"));
}

// Barracks Placement
canvas.addEventListener("click", function (event) {
    if (!playerTurn) return;

    let x = event.offsetX;
    let y = event.offsetY;
    
    if (materials >= 25) {
        barracks.push({ x, y });
        materials -= 25;
        updateUI();
    }
});

// AI Turn Logic
function aiTurn() {
    if (aiStrategy === "aggressive") {
        let attackingTerritory = aiTerritories[Math.floor(Math.random() * aiTerritories.length)];
        let target = territories[Math.floor(Math.random() * territories.length)];
        if (attackingTerritory.units > target.units) {
            target.owner = "AI";
            target.units = attackingTerritory.units - 1;
        }
    } else if (aiStrategy === "defensive") {
        let defensiveTerritory = aiTerritories[Math.floor(Math.random() * aiTerritories.length)];
        defensiveTerritory.units += 2;
    }
    
    playerTurn = true;
    updateUI();
}

// Train Units
document.getElementById("train-warrior").addEventListener("click", () => {
    if (materials >= 50) {
        materials -= 50;
        units += 1;
        updateUI();
    }
});

document.getElementById("train-archer").addEventListener("click", () => {
    if (materials >= 100) {
        materials -= 100;
        units += 1;
        updateUI();
    }
});

document.getElementById("train-defender").addEventListener("click", () => {
    if (materials >= 75) {
        materials -= 75;
        units += 1;
        updateUI();
    }
});

// End Turn
document.getElementById("end-turn").addEventListener("click", () => {
    playerTurn = false;
    aiTurn();
});

// Draw Everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw territories
    territories.forEach((territory) => territory.draw());
    aiTerritories.forEach((territory) => territory.draw());

    // Draw barracks
    barracks.forEach((b) => {
        ctx.fillStyle = "gray";
        ctx.fillRect(b.x, b.y, 40, 40);
    });

    // Draw caves
    caves.forEach((c) => {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawGame);
}

// Update UI
function updateUI() {
    materialsUI.textContent = `Materials: ${materials}`;
    unitsUI.textContent = `Units: ${units}`;
    areaUI.textContent = `Controlled Area: ${controlledArea}`;
}

// Start the game loop
updateUI();
drawGame();
