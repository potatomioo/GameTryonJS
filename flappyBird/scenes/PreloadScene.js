class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        console.log("PreloadScene: preload started");
        
        // Display loading text
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Create background and ground textures
        const bgGraphics = this.make.graphics({x: 0, y: 0, add: false});
        bgGraphics.fillStyle(0x70c5ce); // Sky blue
        bgGraphics.fillRect(0, 0, 320, 480);
        bgGraphics.generateTexture('background', 320, 480);
        
        const groundGraphics = this.make.graphics({x: 0, y: 0, add: false});
        groundGraphics.fillStyle(0xded895); // Light brown
        groundGraphics.fillRect(0, 0, 320, 112);
        groundGraphics.generateTexture('ground', 320, 112);
        
        // Create pipe texture - with a border for better visibility
        const pipeGraphics = this.make.graphics({x: 0, y: 0, add: false});
        pipeGraphics.lineStyle(2, 0x005500, 1); // Dark green border
        pipeGraphics.fillStyle(0x73BF2E); // Green fill
        pipeGraphics.fillRect(0, 0, 52, 320);
        pipeGraphics.strokeRect(0, 0, 52, 320);
        pipeGraphics.generateTexture('pipe', 52, 320);
        
        // Create better bird texture - a circle with some details
        const birdGraphics = this.make.graphics({x: 0, y: 0, add: false});
        // Yellow body
        birdGraphics.fillStyle(0xffff00);
        birdGraphics.fillCircle(16, 16, 16);
        // Eye
        birdGraphics.fillStyle(0xffffff);
        birdGraphics.fillCircle(24, 10, 5);
        birdGraphics.fillStyle(0x000000);
        birdGraphics.fillCircle(24, 10, 2);
        // Beak
        birdGraphics.fillStyle(0xff6600);
        birdGraphics.fillTriangle(28, 16, 38, 12, 28, 20);
        
        birdGraphics.generateTexture('bird0', 38, 32);
        
        console.log("Textures created");
    }

    create() {
        console.log("PreloadScene: create started");
        
        // Create bird animation
        this.anims.create({
            key: 'fly',
            frames: [
                { key: 'bird0' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        console.log("Animation created");
        
        // Move to menu scene
        this.scene.start('MenuScene');
    }
}