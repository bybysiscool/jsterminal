const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player1, player2;
let bullets;
let boss;
let cursors;
let player1HealthBar, player2HealthBar;
const MAX_HEALTH = 5;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('boss', 'assets/boss.png');
    this.load.audio('shoot', 'assets/shoot.mp3');
    this.load.audio('damage', 'assets/damage.mp3');
}

function create() {
    player1 = this.physics.add.sprite(200, 500, 'player').setCollideWorldBounds(true);
    player1.health = MAX_HEALTH;

    player2 = this.physics.add.sprite(600, 500, 'player').setCollideWorldBounds(true);
    player2.health = MAX_HEALTH;

    bullets = this.physics.add.group();

    boss = this.physics.add.sprite(400, 100, 'boss');
    boss.health = 10;
    boss.setVelocity(100, 0);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-W', shootBullet);
    this.input.keyboard.on('keydown-I', shootBulletPlayer2);

    player1HealthBar = this.add.graphics();
    player2HealthBar = this.add.graphics();

    this.physics.add.collider(bullets, boss, hitBoss, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player1.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player1.setVelocityX(160);
    } else {
        player1.setVelocityX(0);
    }

    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.A)) {
        player2.setVelocityX(-160);
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.D)) {
        player2.setVelocityX(160);
    } else {
        player2.setVelocityX(0);
    }

    if (boss.x >= 750 || boss.x <= 50) {
        boss.setVelocityX(-boss.body.velocity.x);
    }

    drawHealthBars();
}

function shootBullet() {
    const bullet = bullets.create(player1.x, player1.y, 'bullet');
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
}

function shootBulletPlayer2() {
    const bullet = bullets.create(player2.x, player2.y, 'bullet');
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
}

function hitBoss(bullet, boss) {
    bullet.destroy();
    boss.health -= 1;
    this.sound.play('damage');
    if (boss.health <= 0) {
        boss.destroy(); // Handle boss defeat
    }
}

function drawHealthBars() {
    player1HealthBar.clear();
    player1HealthBar.fillStyle(0xff0000, 1);
    player1HealthBar.fillRect(player1.x - 25, player1.y - 20, 50 * (player1.health / MAX_HEALTH), 10);

    player2HealthBar.clear();
    player2HealthBar.fillStyle(0xff0000, 1);
    player2HealthBar.fillRect(player2.x - 25, player2.y - 20, 50 * (player2.health / MAX_HEALTH), 10);
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    game.scene.start();
}

function startStoryMode() {
    alert("Story Mode is not fully implemented yet.");
}
