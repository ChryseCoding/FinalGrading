class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }

    preload() {
        this.load.image("spriteBg0", "assets/imgs/sprBg0.png");
        this.load.image("spriteBg1", "assets/imgs/sprBg1.png");
        this.load.spritesheet("spriteExplosion", "assets/audio/sprExplosion.png")

        this.load.image("spriteLaserPlayer", "assets/imgs/sprLaserPlayer.png");
        this.load.image("spritePlayer", "assets/imgs/ship.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("spriteEnemy1", "assets/imgs/shinyball.png");
        this.load.spritesheet("spriteEnemy2", "assets/imgs/sprEnemy0.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("spriteLaserEnemy", "assets/imgs/sprLaserEnemy0");

        this.load.audio("sndExplode", "assets/audio/sndExplode0.wav");
        this.load.audio("sndExplode1", "assets/audio/sndExplode1.wav");
        this.load.audio("sndLaser", "assets/audio/sndLaser.wav");

    }

    create() {
        this.anims.create({
            key: "spriteEnemy1",
            frames: this.anims.generateFrameNumbers("spriteEnemy1"),
            frameRate: 20,
            repeat: -1
        });
      
        this.anims.create({
            key: "spriteEnemy2",
            frames: this.anims.generateFrameNumbers("spriteEnemy2"),
            frameRate: 20,
            repeat: -1
        });
      
        this.anims.create({
            key: "spriteExplosion",
            frames: this.anims.generateFrameNumbers("spriteExplosion"),
            frameRate: 20,
            repeat: 0
        });
      
        this.anims.create({
            key: "spritePlayer",
            frames: this.anims.generateFrameNumbers("spritePlayer"),
            frameRate: 20,
            repeat: -1
        });

        this.sfx = {
            explosions: [
                this.sound.add("sndExplode"),
                this.sound.add("sndExplode1")
            ],
            laser: this.sound.add("sndLaser")
        };

        

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "spritePlayer"

        );

        this.ship = this.add.image(100, 100, 'ship');

        this.input.on('pointermove', (pointer) => {

            this.ship.x = pointer.x;
            this.ship.y = pointer.y;

        });

        this.input.on('pointerdown', (pointer) => {

            this.bullets.fireBullet(this.ship.x, this.ship.y);

        });

        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: function() {
                let enemy = null;

                if (Phaser.Math.Between(0, 10) >= 3) {
                  enemy = new EnemyShip(
                    this,
                    Phaser.Math.Between(0, this.game.config.width),
                    0
                  );
                }
                else {
                  enemy = new Asteroids(
                    this,
                    Phaser.Math.Between(0, this.game.config.width),
                    0
                  );
                }
            
                if (enemy !== null) {
                  enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
                  this.enemies.add(enemy);
                }
            },
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                  enemy.onDestroy();
                }
              
                enemy.explode(true);
                playerLaser.destroy();
            }
        });

        this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                  enemy.onDestroy();
                }
              
                enemy.explode(true);
                playerLaser.destroy();
            }
        });

        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
              player.explode(false);
              player.onDestroy();
              enemy.explode(true);
            }
        });

        this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
            if (!player.getData("isDead") &&
                !laser.getData("isDead")) {
              player.explode(false);
              player.onDestroy();
              laser.destroy();
            }
        });
    }

    update() {
        if(!this.player.getData("isDead")) {
            this.player.update();

        }

        

        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

    }

    getEnemiesByType(type) {
        let arr = [];
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];
            if (enemy.getData("type") == type) {
            arr.push(enemy);
            }
        }
        return arr;
    }
}
