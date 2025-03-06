// Game settings
const gameSettings = {
    playerGravity: 800,
    playerJump: -300,
    pipeSpeed: 200,
    pipeSpacing: 250,
    pipeGap: 100,
    localStorageName: 'flappyBirdHighScore'
};

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#70c5ce',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene]
};

// Create the game instance
const game = new Phaser.Game(config);