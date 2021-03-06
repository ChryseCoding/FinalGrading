let config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 640,
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
        gravity: { x: 0, y: 0 }
        }
    },
    scene: [
        SceneMainMenu,
        SceneGame,
        SceneGameover
    ],
    pixelArt: true,
    roundPixels: true
}

let game = new Phaser.Game(config);