let playerGraphics;
let cursors;
let bullets;
let bosses;

function preload() {
    this.load.audio('shoot', 'shoot.mp3');
    this.load.audio('damage', 'damage.mp3');
}

function create() {
    // Set up the player as a graphics object
    playerGraphics = this.add.graphics();
    drawPlayerCircle(this, 400, 300);

    // Set up cursors for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Create a bullets group
    bullets = this.physics.add.group();

    // Create a group for bosses
    bosses = this.physics.add.group();

    // Spawn the boss
    spawnBoss();

    // Create an event listener for shooting
    this.input.keyboard.on('keydown-K', shoot);
}

function update() {
    // Player movement
    if (cursors.left.isDown) {
        playerGraphics.x -= 5;
    } else if (cursors.right.isDown) {
        playerGraphics.x += 5;
    }

    if (cursors.up.isDown) {
        playerGraphics.y -= 5;
    } else if (cursors.down.isDown) {
        playerGraphics.y += 5;
    }

    // Limit movement within the game area
    playerGraphics.x = Phaser.Math.Clamp(playerGraphics.x, 20, 780);
    playerGraphics.y = Phaser.Math.Clamp(playerGraphics.y, 20, 580);
}

// Function to draw the player circle
function drawPlayerCircle(scene, x, y) {
    playerGraphics.clear();
    playerGraphics.fillStyle(0x00ff00, 1); // Green player circle
    playerGraphics.fillCircle(x, y, 20); // Draw the player circle
}

// Function to spawn a boss
function spawnBoss() {
    const boss = this.add.graphics(); // Create graphics for the boss
    boss.fillStyle(0xff0000, 1); // Red color for the boss
    boss.fillCircle(600, 300, 40); // Draw the boss circle
    bosses.add(boss);

    // Move the boss with a simple tween
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
    const bullet = bullets.create(playerGraphics.x, playerGraphics.y, null); // Create a bullet
    bullet.setCircle(5); // Circle for the bullet
    bullet.setFillStyle(0xffff00); // Yellow bullet color
    bullet.setVelocityY(-300); // Move the bullet upwards

    // Play shooting sound
    this.sound.play('shoot');
}

// Additional helper function to draw the boss circle if needed
function drawBossCircle(boss) {
    if (boss.clear) {
        boss.clear(); // Clear previous drawing
    }
    boss.fillStyle(0xff0000, 1); // Boss color
    boss.fillCircle(600, 300, 40); // Draw the boss
}
