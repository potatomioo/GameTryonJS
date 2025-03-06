class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        console.log("GameOverScene: create started");
        
        // Add background with semi-transparent overlay
        this.add.image(0, 0, 'background').setOrigin(0);
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);
        
        // Add ground
        this.add.image(0, this.cameras.main.height - 112, 'ground').setOrigin(0);
        
        // Add game over text
        this.add.text(this.cameras.main.width / 2, 150, 'GAME OVER', {
            font: 'bold 40px Arial',
            fill: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Add score text
        this.add.text(this.cameras.main.width / 2, 220, `Score: ${this.score}`, {
            font: '25px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Get and display high score
        const highScore = localStorage.getItem(gameSettings.localStorageName) || 0;
        this.add.text(this.cameras.main.width / 2, 260, `Best: ${highScore}`, {
            font: '25px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Add "New High Score" text if applicable
        if (this.score > highScore) {
            this.add.text(this.cameras.main.width / 2, 300, 'New High Score!', {
                font: 'bold 25px Arial',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
        }
        
        // Add restart button
        const restartButton = this.add.text(this.cameras.main.width / 2, 350, 'Restart', {
            font: 'bold 25px Arial',
            fill: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        }).setOrigin(0.5)
          .setInteractive();
          
        // Add menu button
        const menuButton = this.add.text(this.cameras.main.width / 2, 410, 'Menu', {
            font: 'bold 25px Arial',
            fill: '#ffffff',
            backgroundColor: '#2196F3',
            padding: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        }).setOrigin(0.5)
          .setInteractive();
          
        // Button click handlers
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // Restart on spacebar
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        console.log("GameOverScene: setup complete");
    }
}