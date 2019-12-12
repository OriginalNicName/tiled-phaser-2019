class BaseScene extends Phaser.Scene {
    map;
    player;
    cursors;
    camera;
    exitLayer;
    score;

    constructor(key) {
        super(key);
    }

    create() {
        //create tilemap and attach tilesets

        this.map.landscape = this.map.addTilesetImage('landscape-tileset', 'landscape-image');
        this.map.props = this.map.addTilesetImage('props-tileset', 'props-image');
        //set world bounds 
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.map.createStaticLayer('Background', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('Background 2', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('Platforms', [this.map.landscape, this.map.props], 0, 0);
        this.createPlayer();
        this.createCollision();
        this.map.createStaticLayer('Foreground', [this.map.landscape, this.map.props], 0, 0);
        this.exitLayer = this.map.createStaticLayer('Exit', [this.map.landscape, this.map.props], 0, 0);
        this.setCamera();
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.player.setVelocityY(-300);
        }

    }


    createPlayer() {
        this.player = this.physics.add.sprite(2 * this.map.tileWidth, 21 * this.map.tileHeight, 'player', 1);
        this.player.setCollideWorldBounds(true);
    }

    createCollision() {
        this.collisionLayer = this.map.getLayer('Platforms').tilemapLayer;
        this.collisionLayer.setCollisionBetween(0, 1000);
        this.physics.add.collider(this.player, this.collisionLayer);
    }
    setCamera() {
        this.camera = this.cameras.getCamera("");
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.setZoom(2);
    }
}
class SceneA extends BaseScene {
    constructor() {
        super('SceneA');
    }
    preload() {
        this.load.image('landscape-image', '../assets/landscape-tileset.png');
        this.load.image('props-image', '../assets/props-tileset.png');
        this.load.spritesheet('player', '../assets/player.png', {
            frameWidth: 24, frameHeight: 24
        });
        this.load.tilemapTiledJSON('level1', '../assets/level1.json');
    }
    create() {
        this.map = this.make.tilemap({
            key: 'level1'
        });
        super.create();
    }
    update() {
        super.update();
        let tile = this.exitLayer.getTileAtWorldXY(this.player.x, this.player.y);
        if (tile) {
            switch (tile.index) {
                case 200:
                case 201:
                case 206:
                case 207:
                    this.processExit();
                    break;
            }
        }
    }
    processExit() {
        // console.log('player reached exit');
        this.scene.start('SceneB');
        this.scene.start('SceneB', { score: this.score });
    }
}
class SceneB extends BaseScene {
    constructor() {
        super('SceneB');

    }
    init(data) {
        this.score = data.score;
    }
    preload() {
        this.load.image('landscape-image', '../assets/landscape-tileset.png');
        this.load.image('props-image', '../assets/props-tileset.png');
        this.load.spritesheet('player', '../assets/player.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        this.load.tilemapTiledJSON('level2', '../assets/level2.json');
    }
    create() {
        console.log('this score = ' + this.score);
        this.map = this.make.tilemap({
            key: 'level2'
        });
        super.create();
    }
}