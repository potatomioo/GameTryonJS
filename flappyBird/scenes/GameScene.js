class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        console.log("GameScene: create started");
        
        // Initialize game variables
        this.isGameOver = false;
        this.score = 0;
        this.pipeGroup = this.physics.add.group();
        this.scoreTimers = []; // Store timer references
        this.nextPipeTime = 0;
        
        // Add background
        this.add.image(0, 0, 'background').setOrigin(0);
        
        // Add moving ground
        this.ground = this.add.tileSprite(0, this.cameras.main.height - 112, this.cameras.main.width, 112, 'ground')
            .setOrigin(0, 0);
            
        // Create an invisible physics body for the ground
        this.groundBody = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 56, 'ground')
            .setVisible(false)
            .setImmovable(true)
            .setSize(this.cameras.main.width, 112)
            .setDisplaySize(this.cameras.main.width, 112);
        this.groundBody.body.allowGravity = false;
        
        // Add score text
        this.scoreText = this.add.text(this.cameras.main.width / 2, 50, '0', {
            font: 'bold 35px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Add bird
        this.bird = this.physics.add.sprite(80, this.cameras.main.height / 2 - 50, 'bird0')
            .setOrigin(0.5);
        
        // Set bird physics properties
        this.bird.body.gravity.y = gameSettings.playerGravity;
        
        // Add collision detection
        this.physics.add.collider(this.bird, this.groundBody, this.gameOver, null, this);
        this.physics.add.collider(this.bird, this.pipeGroup, this.gameOver, null, this);
        
        // Input handlers
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
        
        // Initial pipe after a short delay
        this.time.delayedCall(1000, this.addRowOfPipes, [], this);
        
        console.log("GameScene: setup complete");
    }
    
    update(time, delta) {
        if (this.isGameOver) {
            return;
        }
        
        // Move ground
        this.ground.tilePositionX += 2;
        
        // Bird rotation based on velocity
        if (this.bird.body.velocity.y > 0) {
            // Bird falling
            this.bird.angle = Math.min(this.bird.angle + 2, 90);
        } else {
            // Bird rising
            this.bird.angle = -15;
        }
        
        // Check for ceiling collision
        if (this.bird.y <= 0) {
            this.bird.y = 0;
            this.bird.body.velocity.y = 50;
        }
        
        // Add new pipes
        if (time > this.nextPipeTime) {
            this.addRowOfPipes();
            this.nextPipeTime = time + 1500; // Time in ms between pipe sets
        }
        
        // Remove pipes that are off screen
        this.pipeGroup.getChildren().forEach(pipe => {
            if (pipe.x < -pipe.width) {
                this.pipeGroup.remove(pipe, true, true);
            }
        });
    }
    
    flap() {
        if (this.isGameOver) {
            return;
        }
        
        // Make bird jump
        this.bird.body.velocity.y = gameSettings.playerJump;
    }
    
    addRowOfPipes() {
        console.log("Adding pipes");
        
        // Determine gap position
        const holePosition = Phaser.Math.Between(1, 5);
        const pipeGap = gameSettings.pipeGap;
        
        // Top pipe
        const topPipe = this.pipeGroup.create(
            this.cameras.main.width + 50,
            (holePosition * 60) - 320 + 20,  // Adjust to have the bottom at the gap
            'pipe'
        );
        topPipe.setOrigin(0.5, 0);  // Origin at middle-top
        topPipe.body.allowGravity = false;
        topPipe.body.immovable = true;
        topPipe.body.velocity.x = -200;
        
        // Bottom pipe
        const bottomPipe = this.pipeGroup.create(
            this.cameras.main.width + 50,
            (holePosition * 60) + pipeGap,  // Start at the gap
            'pipe'
        );
        bottomPipe.setOrigin(0.5, 0);  // Origin at middle-top
        bottomPipe.body.allowGravity = false;
        bottomPipe.body.immovable = true;
        bottomPipe.body.velocity.x = -200;
        
        // Create an invisible score zone in the gap
        const scoreZone = this.physics.add.sprite(
            this.cameras.main.width + 50,
            (holePosition * 60) + (pipeGap / 2),
            null
        );
        scoreZone.setSize(5, pipeGap);
        scoreZone.body.allowGravity = false;
        scoreZone.body.velocity.x = -200;
        
        // Track if this has been scored
        scoreZone.scored = false;
        this.pipeGroup.add(scoreZone);
        
        // Check for passing the score zone
        const timer = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (!scoreZone.scored && scoreZone.x < this.bird.x) {
                    scoreZone.scored = true;
                    this.score += 1;
                    this.scoreText.setText(this.score.toString());
                }
            },
            callbackScope: this,
            loop: true
        });
        
        // Store the timer reference so we can clean it up later
        this.scoreTimers.push(timer);
    }
    
    gameOver() {
        if (this.isGameOver) {
            return;
        }
        
        console.log("Game over");
        
        // Set game over flag
        this.isGameOver = true;
        
        // Stop all pipes
        this.pipeGroup.getChildren().forEach(pipe => {
            pipe.body.velocity.x = 0;
        });
        
        // Clean up score timers
        this.scoreTimers.forEach(timer => timer.remove());
        this.scoreTimers = [];
        
        // Update high score in local storage
        const highScore = localStorage.getItem(gameSettings.localStorageName) || 0;
        if (this.score > highScore) {
            localStorage.setItem(gameSettings.localStorageName, this.score);
        }
        
        // Transition to game over scene after delay
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
}