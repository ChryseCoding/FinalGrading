class SceneMainMenu extends Phaser.Scene {
    constructor () {
        super({ key: "SceneMainMenu" });
    }

    preload() {
        this.load.image("background", "../assets/imgs/logo.png");
        
    }

    create () {
        const gl = this.sys.game.renderer.gl;

        const renderer = this.sys.game.renderer;

        const modeIndex = renderer.addBlendMode([ gl.ZERO, gl.SRC_COLOR ], gl.FUNC_ADD);

        const graphics = this.add.graphics();

        const color = 0xffffff;
        const alpha = 1;

        graphics.fillStyle(color, alpha);

        graphics.fillCircle(250, 250, 256);

        this.add.image(250, 250, 'background').setBlendMode(modeIndex);
        this.input.on('pointerdown', () => this.scene.start('SceneGame'))

        this.title = this.add.text(this.game.config.width * 0.5, 128, "CLICK TO PLAY", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5, -8);

    }

    update() {
        
    }

    
}

