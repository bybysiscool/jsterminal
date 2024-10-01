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
    // Create graphics for player sprites
    player1 = this.add.graphics({ fillStyle: { color: 0x00ff00 } });
    player1.x = 200;
    player1.y = 500;

    player2 = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    player2.x = 600;
    player2.y = 500;

    bullets = this.physics.add.group();
    bosses = this.physics.add.group();

    spawnBoss();

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-W', shootBullet);
    this.input.keyboard.on('keydown-I', shootBulletPlayer2);

    player1HealthBar = this.add.graphics();
    player2HealthBar = this.add.graphics();

    this.physics.add.collider(bullets, bosses, hitBoss, null, this);

    // Draw initial circles
    drawPlayerCircle(player1);
    drawPlayerCircle(player2);
}

function update() {
    // Player 1 Movement
    if (cursors.left.isDown) {
        player1.x -= 5; // Adjust speed for smoother movement
    } else if (cursors.right.isDown) {
        player1.x += 5;
    }

    // Player 2 Movement
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.A)) {
        player2.x -= 5;
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.D)) {
        player2.x += 5;
    }

    // Update boss movement
    bosses.getChildren().forEach(boss => {
        moveBoss(boss);
    });

    drawHealthBars();
}

function shootBullet() {
    const bullet = bullets.create(player1.x, player1.y, null); // Create a bullet
    bullet.setCircle(5); // Create bullet shape
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
    drawBulletCircle(bullet);
}

function shootBulletPlayer2() {
    const bullet = bullets.create(player2.x, player2.y, null); // Create a bullet
    bullet.setCircle(5); // Create bullet shape
    bullet.setVelocityY(-300);
    this.sound.play('shoot');
    drawBulletCircle(bullet);
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
    const boss = bosses.create(Phaser.Math.Between(100, 700), 50, null); // Create a boss
    boss.health = 10;
    boss.setVelocity(Phaser.Math.Between(-50, 50), 0);
    boss.setCircle(30); // Create boss shape
    drawBossCircle(boss);
}

function moveBoss(boss) {
    // Boss movement pattern
    if (boss.x >= 770 || boss.x <= 30) {
        boss.setVelocityX(-boss.body.velocity.x); // Reverse direction
    }
}

function drawPlayerCircle(player) {
    player.clear();
    player.fillCircle(0, 0, 15); // Draw player circle
}

function drawBulletCircle(bullet) {
    bullet.clear();
    bullet.fillStyle(0xffff00, 1); // Yellow bullets
    bullet.fillCircle(0, 0, 5); // Draw bullet circle
}

function drawBossCircle(boss) {
    boss.clear();
    boss.fillStyle(0xff00ff, 1); // Purple bosses
    boss.fillCircle(0, 0, 30); // Draw boss circle
}

function drawHealthBars() {
    player1HealthBar.clear();
    player1HealthBar.fillStyle(0xff0000, 1);
    player1HealthBar.fillRect(player1.x - 25, player1.y - 20, 50 * (MAX_HEALTH / MAX_HEALTH), 10);

    player2HealthBar.clear();
    player2HealthBar.fillStyle(0xff0000, 1);
    player2HealthBar.fillRect(player2.x - 25, player2.y - 20, 50 * (MAX_HEALTH / MAX_HEALTH), 10);
}
