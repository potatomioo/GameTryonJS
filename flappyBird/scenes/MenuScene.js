class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        console.log("MenuScene: create started");
        
        // Add background
        this.add.image(0, 0, 'background').setOrigin(0);
        
        // Add ground
        this.ground = this.add.tileSprite(0, this.cameras.main.height - 112, this.cameras.main.width, 112, 'ground')
            .setOrigin(0, 0);
            
        // Add title
        this.add.text(this.cameras.main.width / 2, 100, 'FLAPPY BIRD', {
            font: 'bold 30px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Add bird sprite
        this.bird = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bird0')
            .setScale(1.5)
            .play('fly');
            
        // Add floating animation to the bird
        this.tweens.add({
            targets: this.bird,
            y: this.bird.y - 20,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add start button
        const startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Start Game', {
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
          
        // Start game on button click
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Start game on spacebar
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        console.log("MenuScene: setup complete");
    }
    
    update() {
        // Move ground
        this.ground.tilePositionX += 2;
    }
}