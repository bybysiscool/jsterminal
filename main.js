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
let bosses;
let cursors;
let player1HealthBar, player2HealthBar;
const MAX_HEALTH = 5;

function preload() {
    this.load.audio('shoot', 'shoot.mp3');
    this.load.audio('damage', 'damage.mp3');
}

function create() {
    // Create circular player sprites
    player1 = this.physics.add.sprite(200, 500, null).setCircle(15).setFillStyle(0x00ff00); // Green for Player 1
    player1.health = MAX_HEALTH;

    player2 = this.physics.add.sprite(600, 500, null).setCircle(15).setFillStyle(0xff0000); // Red for Player 2
    player2.health = MAX_HEALTH;

    bullets = this.physics.add.group();

    bosses = this.physics.add.group();
    spawnBoss();

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-W', shootBullet);
    this.input.keyboard.on('keydown-I', shootBulletPlayer2);

    player1HealthBar = this.add.graphics();
    player2HealthBar = this.add.graphics();

    this.physics.add.collider(bullets, bosses, hitBoss, null, this);
}

function update() {
    // Player 1 Movement
    if (cursors.left.isDown) {
        player1.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player1.setVelocityX(200);
    } else {
        player1.setVelocityX(0);
    }

    // Player 2 Movement
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.A)) {
        player2.setVelocityX(-200);
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.D)) {
        player2.setVelocityX(200);
    } else {
        player2.setVelocityX(0);
    }

    // Update boss movement
    bosses.getChildren().forEach(boss => {
        moveBoss(boss);
    });

    drawHealthBars();
}

function shootBullet() {
    const bullet = bullets.create(player1.x, player1.y, null).setCircle(5).setFillStyle(0xffff00); // Yellow bullets
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
}

function shootBulletPlayer2() {
    const bullet = bullets.create(player2.x, player2.y, null).setCircle(5).setFillStyle(0xffff00); // Yellow bullets
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
}

function hitBoss(bullet, boss) {
    bullet.destroy();
    boss.health -= 1;
    this.sound.play('damage');
    if (boss.health <= 0) {
        boss.destroy(); // Handle boss defeat
        spawnBoss(); // Spawn new boss
    }
}

function spawnBoss() {
    const boss = bosses.create(Phaser.Math.Between(100, 700), 50, null).setCircle(30).setFillStyle(0xff00ff); // Purple bosses
    boss.health = 10;
    boss.setVelocity(Phaser.Math.Between(-50, 50), 0);
}

function moveBoss(boss) {
    // Boss movement pattern
    if (boss.x >= 770 || boss.x <= 30) {
        boss.setVelocityX(-boss.body.velocity.x); // Reverse direction
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
