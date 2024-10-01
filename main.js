let player;
let cursors;
let bullets;
let bosses;
let bossHealth = 100; // Example health
let shootingSound, damageSound;

function preload() {
    this.load.audio('shoot', 'shoot.mp3');
    this.load.audio('damage', 'damage.mp3');
}

function create() {
    // Set up the player
    player = this.physics.add.sprite(400, 300, null);
    player.setCircle(20); // Create a circle hitbox
    player.setFillStyle(0x00ff00); // Green player circle

    // Set up cursors for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Create a bullets group
    bullets = this.physics.add.group();

    // Create a group for bosses
    bosses = this.physics.add.group();

    // Add shooting sound
    shootingSound = this.sound.add('shoot');
    damageSound = this.sound.add('damage');

    // Spawn the boss
    spawnBoss();
}

function update() {
    // Player movement
    if (cursors.left.isDown) {
        player.x -= 5;
    } else if (cursors.right.isDown) {
        player.x += 5;
    }

    if (cursors.up.isDown) {
        player.y -= 5;
    } else if (cursors.down.isDown) {
        player.y += 5;
    }

    // Limit movement within the game area
    Phaser.Math.Clamp(player.x, 20, 780);
    Phaser.Math.Clamp(player.y, 20, 580);
}

// Function to spawn a boss
function spawnBoss() {
    const boss = this.add.graphics(); // Create graphics for the boss
    boss.fillStyle(0xff0000, 1); // Red color for the boss
    boss.fillCircle(600, 300, 40); // Draw the boss circle
    bosses.add(boss);

    // Move the boss
    this.tweens.add({
        targets: boss,
        x: 100,
        duration: 2000,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
    });
}

// Function to shoot bullets
function shoot() {
    const bullet = bullets.create(player.x, player.y, null); // Create a bullet sprite
    bullet.setCircle(5); // Circle for the bullet
    bullet.setFillStyle(0xffff00); // Yellow bullet color
    bullet.setVelocityY(-300); // Move the bullet upwards

    // Play shooting sound
    shootingSound.play();
}

function drawBossCircle(boss) {
    if (boss.clear) {
        boss.clear(); // Clear previous drawing
    }
    boss.fillStyle(0xff0000, 1); // Boss color
    boss.fillCircle(600, 300, 40); // Draw the boss
}

// Example key bindings
this.input.keyboard.on('keydown-K', shoot);
