// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

// Game state
let gameStarted = false;
let gameOver = false;
let score = 0;
let frameCount = 0;

// Game Objects
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 24,
    gravity: 0.25,
    velocity: 0,
    jump: -4.6,
    color: '#ffff00',
    
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Collision with ground
        if (this.y + this.height >= ground.y) {
            this.y = ground.y - this.height;
            gameOver = true;
        }
        
        // Ceiling collision
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eye (simple detail)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 22, this.y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
    },
    
    doJump: function() {
        if (!gameOver) {
            this.velocity = this.jump;
        }
    }
};

const pipes = {
    list: [],
    width: 50,
    gap: 125,
    speed: 2,
    spawnRate: 120, // frames
    
    create: function() {
        // Random pipe opening position
        const minHeight = 50;
        const maxHeight = canvas.height - ground.height - this.gap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        
        // Create a pair of pipes
        this.list.push({
            x: canvas.width,
            y: 0,
            width: this.width,
            height: height,
            passed: false,
            color: '#73BF2E'
        });
        
        // Bottom pipe
        this.list.push({
            x: canvas.width,
            y: height + this.gap,
            width: this.width,
            height: canvas.height - height - this.gap - ground.height,
            passed: false,
            color: '#73BF2E'
        });
    },
    
    update: function() {
        this.list.forEach(pipe => {
            pipe.x -= this.speed;
            
            // Check if the bird passed the pipe
            if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                pipe.passed = true;
                // Only count score once per pipe pair
                if (pipe.y === 0) {
                    score += 1;
                }
            }
            
            // Collision detection
            if (
                bird.x + bird.width > pipe.x && 
                bird.x < pipe.x + pipe.width && 
                bird.y + bird.height > pipe.y && 
                bird.y < pipe.y + pipe.height
            ) {
                gameOver = true;
            }
        });
        
        // Remove pipes that have moved off screen
        if (this.list.length > 0 && this.list[0].x + this.width < 0) {
            this.list.splice(0, 2); // Remove pipe pair
        }
        
        // Create new pipes
        if (frameCount % this.spawnRate === 0) {
            this.create();
        }
    },
    
    draw: function() {
        this.list.forEach(pipe => {
            ctx.fillStyle = pipe.color;
            ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        });
    }
};

const ground = {
    y: canvas.height - 30,
    height: 30,
    color: '#ded895',
    
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, this.y, canvas.width, this.height);
    }
};

// Game functions
function drawBackground() {
    // Sky is already the canvas background color
    
    // Draw some clouds
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(50, 50, 20, 0, Math.PI * 2);
    ctx.arc(70, 50, 15, 0, Math.PI * 2);
    ctx.arc(90, 50, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(250, 80, 20, 0, Math.PI * 2);
    ctx.arc(270, 80, 15, 0, Math.PI * 2);
    ctx.arc(290, 80, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score, canvas.width / 2, 50);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.font = '18px Arial';
    ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 30);
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.list = [];
    score = 0;
    gameOver = false;
    frameCount = 0;
}

// Main game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    if (gameStarted) {
        frameCount++;
        
        if (!gameOver) {
            bird.update();
            pipes.update();
        }
        
        pipes.draw();
        bird.draw();
        drawScore();
        
        if (gameOver) {
            drawGameOver();
        }
    }
    
    ground.draw();
    
    requestAnimationFrame(update);
}

// Event listeners
startButton.addEventListener('click', () => {
    gameStarted = true;
    startScreen.style.display = 'none';
});

canvas.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
    } else if (gameOver) {
        resetGame();
    } else {
        bird.doJump();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        if (!gameStarted) {
            gameStarted = true;
            startScreen.style.display = 'none';
        } else if (gameOver) {
            resetGame();
        } else {
            bird.doJump();
        }
    }
});


// Start the game loop
update();