class Boot extends Phaser.Scene {
    create(){
        this.addScenes();
        this.scene.start('preloader');
        
    }
    
    addScenes(){
        this.scene.add('preloader', Preloader);
        this.scene.add('game', Game);
    }
}