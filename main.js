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
    this.spawnBoss(); // Call the method on the scene context

    // Create an event listener for shooting
    this.input.keyboard.on('keydown-K', shoot.bind(this)); // Bind context for shoot
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
    drawBossCircle(boss); // Draw the boss initially
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

    // Add boss logic here if needed (like shooting bullets)
}

// Function to shoot bullets
function shoot() {
    const bullet = this.add.graphics(); // Create a graphic for the bullet
    bullet.fillStyle(0xffff00, 1); // Yellow bullet color
    bullet.fillCircle(playerGraphics.x, playerGraphics.y, 5); // Draw the bullet

    // Move the bullet upwards
    this.tweens.add({
        targets: bullet,
        y: bullet.y - 600, // Move bullet up
        duration: 1000,
        onComplete: () => bullet.destroy() // Remove bullet after it goes off screen
    });

    // Play shooting sound
    this.sound.play('shoot');
}

// Helper function to draw the boss circle
function drawBossCircle(boss) {
    boss.clear(); // Clear previous drawing
    boss.fillStyle(0xff0000, 1); // Boss color
    boss.fillCircle(600, 300, 40); // Draw the boss
}

// Bind spawnBoss to the Phaser scene
Phaser.Scene.prototype.spawnBoss = spawnBoss;
