const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const instructionsElement = document.getElementById('instructions');

// Colors
const white = '#ffffff';
const red = '#ff0000';
const black = '#000000';
const pink = '#ffb6c1'; // For welcome screen

// Game variables
let snake = [{x: 45, y: 55}];
let direction = {x: 0, y: 0};
let apple = {x: 0, y: 0};
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameRunning = false;
let gameOver = false;
const snakeSize = 30;
const initVelocity = 5;
const fps = 40;

// Initialize game
function init() {
    generateApple();
    updateScore();
    drawWelcome();
}

// Generate random apple position
function generateApple() {
    apple.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    apple.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Draw welcome screen
function drawWelcome() {
    ctx.fillStyle = pink;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = black;
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to Snake Game by PythonGeeks', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Press Space to Play', canvas.width / 2, canvas.height / 2 + 20);
}

// Start game
function startGame() {
    gameRunning = true;
    gameOver = false;
    snake = [{x: 45, y: 55}];
    direction = {x: 0, y: 0};
    score = 0;
    generateApple();
    updateScore();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    setTimeout(gameLoop, 1000 / fps);
}

// Update game state
function update() {
    if (gameOver) return;

    // Move snake
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    // Check apple collision
    if (Math.abs(head.x - apple.x) < snakeSize && Math.abs(head.y - apple.y) < snakeSize) {
        score += 10;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        generateApple();
    } else {
        snake.pop();
    }

    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            break;
        }
    }

    updateScore();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = red;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over! Press Enter to continue', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Draw apple
    ctx.fillStyle = red;
    ctx.fillRect(apple.x, apple.y, snakeSize, snakeSize);

    // Draw snake
    ctx.fillStyle = black;
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (!gameRunning) {
        if (e.code === 'Space') {
            startGame();
        }
        return;
    }

    if (gameOver) {
        if (e.code === 'Enter') {
            init();
        }
        return;
    }

    switch (e.code) {
        case 'ArrowRight':
            if (direction.x === 0) direction = {x: initVelocity, y: 0};
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = {x: -initVelocity, y: 0};
            break;
        case 'ArrowUp':
            if (direction.y === 0) direction = {x: 0, y: -initVelocity};
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = {x: 0, y: initVelocity};
            break;
    }
});

// Initialize the game
init();
