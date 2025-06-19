const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 24;
const AI_X = WIDTH - 24 - PADDLE_WIDTH;
const PADDLE_SPEED = 8;
const BALL_SPEED = 6;

// State
let playerY = (HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = (WIDTH - BALL_SIZE) / 2;
let ballY = (HEIGHT - BALL_SIZE) / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Mouse control for player paddle
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = '#fff') {
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function resetBall() {
    ballX = (WIDTH - BALL_SIZE) / 2;
    ballY = (HEIGHT - BALL_SIZE) / 2;
    ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

function updateAI() {
    // Simple AI: follow the ball with some lag
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ballY + BALL_SIZE / 2 < aiCenter - 10) {
        aiY -= PADDLE_SPEED * 0.7;
    } else if (ballY + BALL_SIZE / 2 > aiCenter + 10) {
        aiY += PADDLE_SPEED * 0.7;
    }
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function updateBall() {
    ballX += ballVX;
    ballY += ballVY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballVY *= -1;
        ballY = Math.max(0, Math.min(HEIGHT - BALL_SIZE, ballY));
    }

    // Left paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballX >= PLAYER_X &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballVX = Math.abs(ballVX);
        // Add spin based on where it hit the paddle
        let impact = ((ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballVY = BALL_SPEED * impact;
    }

    // Right paddle collision
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballX + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballVX = -Math.abs(ballVX);
        let impact = ((ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballVY = BALL_SPEED * impact;
    }

    // Left or right wall (score)
    if (ballX < 0 || ballX + BALL_SIZE > WIDTH) {
        resetBall();
    }
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#0ff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#f44');

    // Draw ball
    drawBall(ballX, ballY, BALL_SIZE, '#fff');

    // Draw net
    for (let y = 0; y < HEIGHT; y += 32) {
        drawRect((WIDTH-PADDLE_WIDTH)/2, y, PADDLE_WIDTH/2, 16, '#fff3');
    }
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();