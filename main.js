let playerGraphics;
let bullets;
let bosses;
let playerHealth = 100; // Player health
let bossHealth = 100; // Boss health
let healthText; // To display health

function preload() {
    this.load.audio('shoot', 'shoot.mp3');
    this.load.audio('damage', 'damage.mp3');
}

function create() {
    // Set up the player as a graphics object
    playerGraphics = this.add.graphics();
    drawPlayerCircle(this, 400, 300);

    // Create a bullets group
    bullets = this.physics.add.group();

    // Create a group for bosses
    bosses = this.physics.add.group();

    // Spawn the boss
    this.spawnBoss(); // Call the method on the scene context

    // Display health text
    healthText = this.add.text(10, 10, `Player Health: ${playerHealth}`, { font: '16px Arial', fill: '#fff' });

    // Set up mouse input for shooting
    this.input.on('pointerdown', shoot.bind(this)); // Shoot when mouse is clicked

    // Set up the physics for the bullets
    this.physics.add.collider(bullets, bosses, hitBoss, null, this);
}

function update() {
    // Player follows the mouse
    playerGraphics.x = this.input.x;
    playerGraphics.y = this.input.y;

    // Update health text
    healthText.setText(`Player Health: ${playerHealth}`);
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

    // Boss health bar
    const bossHealthBar = this.add.graphics();
    bossHealthBar.fillStyle(0xff0000, 1); // Red color for boss health
    bossHealthBar.fillRect(550, 50, 100, 10); // Initial boss health bar

    // Boss moves and shoots bullets at the player
    this.time.addEvent({
        delay: 1000, // Boss shoots every second
        callback: () => {
            shootBoss.call(this, boss, bossHealthBar); // Call the shootBoss function
        },
        loop: true
    });

    // Move the boss with a simple tween
    this.tweens.add({
        targets: boss,
        y: 300,
        duration: 2000,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
    });
}

// Function to shoot bullets from the player
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

// Function for the boss to shoot at the player
function shootBoss(boss, bossHealthBar) {
    const bullet = this.add.graphics(); // Create a graphic for the boss bullet
    bullet.fillStyle(0xff0000, 1); // Red bullet color
    bullet.fillCircle(boss.x, boss.y, 5); // Draw the bullet

    // Move the bullet towards the player
    const bulletTween = this.tweens.add({
        targets: bullet,
        y: playerGraphics.y,
        x: playerGraphics.x,
        duration: 2000,
        onComplete: () => {
            bullet.destroy(); // Remove bullet after it reaches player
            if (bullet.x === playerGraphics.x && bullet.y === playerGraphics.y) {
                playerHealth -= 10; // Decrease player health on hit
                this.sound.play('damage');
                if (playerHealth <= 0) {
                    alert("Game Over!");
                    playerHealth = 100; // Reset health
                }
            }
        }
    });

    // Update boss health bar
    bossHealthBar.clear();
    bossHealthBar.fillStyle(0xff0000, 1); // Red color for boss health
    bossHealthBar.fillRect(550, 50, bossHealth, 10); // Draw the boss health bar based on boss health
}

// Helper function to draw the boss circle
function drawBossCircle(boss) {
    boss.clear(); // Clear previous drawing
    boss.fillStyle(0xff0000, 1); // Boss color
    boss.fillCircle(600, 300, 40); // Draw the boss
}

// Function to handle bullet hitting the boss
function hitBoss(bullet, boss) {
    bullet.destroy(); // Destroy the bullet
    boss.bossHealth -= 10; // Decrease boss health

    // Update boss health bar
    boss.bossHealthBar.clear();
    boss.bossHealthBar.fillStyle(0xff0000, 1); // Red color for boss health
    boss.bossHealthBar.fillRect(550, 50, boss.bossHealth, 10); // Update health bar

    // Check if the boss is defeated
    if (boss.bossHealth <= 0) {
        boss.destroy(); // Destroy the boss
        alert("Boss defeated!"); // Notify player
    }
}

// Bind spawnBoss to the Phaser scene
Phaser.Scene.prototype.spawnBoss = spawnBoss;
