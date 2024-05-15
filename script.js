const gameContainer = document.getElementById('gameContainer');
const paddle1 = document.getElementById('paddle1');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');

const gameHeight = gameContainer.clientHeight;
const gameWidth = gameContainer.clientWidth;

let paddle1Y = paddle1.offsetTop;
let paddle2Y = paddle2.offsetTop;
let ballX = ball.offsetLeft;
let ballY = ball.offsetTop;
let ballSpeedX = 4;
let ballSpeedY = 4;
const paddleSpeed = 7;

let paddle1Direction = 0;
let paddle2Direction = 0;

let player1Score = 0;
let player2Score = 0;

const scoreLimit = 10;

const hitSound = new Audio('hit.wav');
const pointSound = new Audio('point.mp3');

function playHitSound() {
    hitSound.currentTime = 0;
    hitSound.play();
}

function playPointSound() {
    pointSound.currentTime = 0;
    pointSound.play();
}

const pausedText = document.createElement('div');
pausedText.textContent = 'PAUSED';
pausedText.style.position = 'absolute';
pausedText.style.top = '50%';
pausedText.style.left = '50%';
pausedText.style.transform = 'translate(-50%, -50%)';
pausedText.style.color = '#fff';
pausedText.style.fontSize = '30px';
pausedText.style.fontWeight = 'bold';
pausedText.style.visibility = 'hidden';

gameContainer.appendChild(pausedText);

function showPausedText() {
    pausedText.style.visibility = 'visible';
}

function hidePausedText() {
    pausedText.style.visibility = 'hidden';
}

let isPaused = false;

document.addEventListener('keydown', event => {
    if (event.key === 'w') {
        paddle1Direction = -1;
    }
    if (event.key === 's') {
        paddle1Direction = 1;
    }
    if (event.key === 'ArrowUp') {
        paddle2Direction = -1;
    }
    if (event.key === 'ArrowDown') {
        paddle2Direction = 1;
    }
    if (event.key === ' ') {
        isPaused = !isPaused;
        if (isPaused) {
            pauseGame();
        } else {
            resumeGame();
        }
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'w' || event.key === 's') {
        paddle1Direction = 0;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        paddle2Direction = 0;
    }
});

function pauseGame() {
    cancelAnimationFrame(gameLoop);
    showPausedText(); 
}

function resumeGame() {
    gameLoop();
    hidePausedText();
}

function updatePaddles() {
    paddle1Y += paddle1Direction * paddleSpeed;
    paddle2Y += paddle2Direction * paddleSpeed;

    if (paddle1Y < 0) paddle1Y = 0;
    if (paddle1Y > gameHeight - paddle1.clientHeight) paddle1Y = gameHeight - paddle1.clientHeight;
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > gameHeight - paddle2.clientHeight) paddle2Y = gameHeight - paddle2.clientHeight;

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (
        (ballX <= paddle1.clientWidth && ballY + ball.clientHeight >= paddle1Y && ballY <= paddle1Y + paddle1.clientHeight) ||
        (ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth && ballY + ball.clientHeight >= paddle2Y && ballY <= paddle2Y + paddle2.clientHeight)
    ) {
        ballSpeedX = -ballSpeedX;
        playHitSound();
    }

    if (ballY <= 0 || ballY >= gameHeight - ball.clientHeight) {
        ballSpeedY = -ballSpeedY;
        playHitSound();
    }


    if (ballX <= 0) {
        player2Score++;
        resetBall();
        updateScore();
        playPointSound();
    }
    if (ballX >= gameWidth - ball.clientWidth) {
        player1Score++;
        resetBall();
        updateScore();
        playPointSound();
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetBall() {
    ballX = gameWidth / 2 - ball.clientWidth / 2;
    ballY = gameHeight / 2 - ball.clientHeight / 2;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1); 
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);  
}

function updateScore() {
    player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
    player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;

    if (player1Score === scoreLimit || player2Score === scoreLimit) {
        endGame();
    }
}

function endGame() {
    const winner = player1Score === scoreLimit ? 'Player 1' : 'Player 2';
    alert(`${winner} wins!`);
    resetGame();
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
    player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
    resetBall();
}

function gameLoop() {
    if (!isPaused) {
        updatePaddles();
        updateBall();
        requestAnimationFrame(gameLoop);
    } else {
        pauseGame();
    }
}

gameLoop();
