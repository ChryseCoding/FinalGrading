class Preloader extends Phaser.Scene {

    constructor () {
        super();
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

        graphics.fillCircle(400, 300, 256);

        this.add.image(400, 300, 'background').setBlendMode(modeIndex);
        this.input.on('pointerdown', () => this.scene.start('game'))

    }

    
}

