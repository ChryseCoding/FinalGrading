class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }

    explode(canDestroy) {
        if (!this.getData("isDead")) {
            
            this.setTexture("spriteExplosion");
            this.play("spriteExplosion"); 
      
            
            this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();
      
            if (this.shootTimer !== undefined) {
              if (this.shootTimer) {
                this.shootTimer.remove(false);
              }
            }
      
            this.setAngle(0);
            this.body.setVelocity(0, 0);
      
            this.on('animationcomplete', function() {
      
              if (canDestroy) {
                this.destroy();
              }
              else {
                this.setVisible(false);
              }
      
            }, this);
      
            this.setData("isDead", true);
        }
    }
}

class Player extends Entity {
    constructor(scene, x, key) {
        super(scene, x, key, "Player");
        this.play("spritePlayer");

        this.setData("isShooting", false);
        this.setData("timerShootDelay", 10);
        this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
    }

    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
        if (this.getData("isShooting")) {
            if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
              this.setData("timerShootTick", this.getData("timerShootTick") + 1);
            }
            else {
              let laser = new PlayerLaser(this.scene, this.x, this.y);
              this.scene.playerLasers.add(laser);
            
              this.scene.sfx.laser.play();
              this.setData("timerShootTick", 0);
            }
        }
    }
}

class PlayerLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "spriteLaserPlayer");
        this.body.velocity.y = -200;
    }
}

class EnemyShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, "spriteEnemy2", "EnemyShip");
      this.body.velocity.y = Phaser.Math.Between(50, 100);

      this.shootTimer = this.scene.time.addEvent({
        delay: 1000,
        callback: function() {
          let laser = new EnemyLaser(
            this.scene,
            this.x,
            this.y
          );
          laser.setScale(this.scaleX);
          this.scene.enemyLasers.add(laser);
        },
        callbackScope: this,
        loop: true
      });

      this.play("spriteEnemy2");
    }

    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
              this.shootTimer.remove(false);
            }
        }
    }
}

class Asteroids extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, "spriteEnemy1", "Asteroids");
      this.body.velocity.y = Phaser.Math.Between(50, 100);
      this.play("spriteEnemy1");
    }
}

class EnemyLaser extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, "spriteLaserEnemy");
      this.body.velocity.y = 200;
    }
}

class ScrollingBackground {
    constructor(scene, key, velocityY) {
        this.scene = scene;
        this.key = key;
        this.velocityY = velocityY;

        this.layers = this.scene.add.group();
        this.createLayers();
    }

    createLayers() {
        for (var i = 0; i < 2; i++) {
            var layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = (layer.displayHeight * i);
            var flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            var flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));
            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.y = this.velocityY;
      
            this.layers.add(layer);
        }
    }

    update() {
        if (this.layers.getChildren()[0].y > 0) {
            for (var i = 0; i < this.layers.getChildren().length; i++) {
              var layer = this.layers.getChildren()[i];
              layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
            }
        }
    }
}