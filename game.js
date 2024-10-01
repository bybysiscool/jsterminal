// Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
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
let player;
let cursors;
let bullets;
let bulletTime = 0;
let enemies;
let enemyBullets;
let shootSound, damageSound;

function preload() {
  this.load.image('player', 'https://i.imgur.com/rQYbT3B.png'); // Placeholder player sprite
  this.load.image('bullet', 'https://i.imgur.com/8ZzMf5U.png'); // Placeholder bullet sprite
  this.load.image('enemy', 'https://i.imgur.com/3m9fKjt.png'); // Placeholder enemy sprite
  this.load.audio('shoot', 'shoot.mp3');
  this.load.audio('damage', 'damage.mp3');
}

function create() {
  // Player setup
  player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
  player.setCollideWorldBounds(true);

  // Bullet setup
  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  cursors = this.input.keyboard.createCursorKeys();

  // Enemy setup
  enemies = this.physics.add.group();
  enemyBullets = this.physics.add.group();

  // Spawn enemies
  for (let i = 0; i < 5; i++) {
    let enemy = enemies.create(100 + i * 150, 100, 'enemy');
    enemy.setScale(0.5);
    enemy.setVelocityY(50); // Slow downward movement
  }

  // Sounds
  shootSound = this.sound.add('shoot');
  damageSound = this.sound.add('damage');

  // Player shooting mechanic
  this.time.addEvent({
    delay: 1000,
    callback: fireEnemyBullets,
    callbackScope: this,
    loop: true
  });
}

function update() {
  // Player movement
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-300);
  } else if (cursors.down.isDown) {
    player.setVelocityY(300);
  }

  // Player shooting
  if (cursors.space.isDown) {
    fireBullet();
  }

  // Bullet collision with enemies
  this.physics.world.collide(bullets, enemies, destroyEnemy, null, this);
}

// Fire a player bullet
function fireBullet() {
  if (this.time.now > bulletTime) {
    let bullet = bullets.get(player.x, player.y - 20);

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-400);
      shootSound.play();
      bulletTime = this.time.now + 200;
    }
  }
}

// Fire bullets from enemies
function fireEnemyBullets() {
  enemies.children.iterate((enemy) => {
    if (enemy.active) {
      let bullet = enemyBullets.create(enemy.x, enemy.y, 'bullet');
      bullet.setVelocityY(200);
    }
  });
}

// Destroy enemy when hit by bullet
function destroyEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  damageSound.play();
}
