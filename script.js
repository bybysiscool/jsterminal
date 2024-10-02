let score = 0;
let cash = 0;
let clickValue = 1;
let upgradeClickCost = 10;
let autoClickCost = 100;
let lastClickTime = 0;
let cps = 0;

// Selectors
const scoreDisplay = document.getElementById('score');
const cashDisplay = document.getElementById('cash');
const cpsDisplay = document.getElementById('cps');
const osakaButton = document.getElementById('osaka');
const clickSound = document.getElementById('click-sound');
const clickEffect = document.getElementById('click-effect');

// Upgrades
const upgradeClickButton = document.getElementById('upgrade1');
const autoClickButton = document.getElementById('upgrade2');

// Clicking Osaka Button
osakaButton.addEventListener('click', (e) => {
  score += clickValue;
  cash += clickValue;
  scoreDisplay.textContent = score;
  cashDisplay.textContent = cash;

  // Play click sound
  clickSound.play();

  // Show click effect
  const rect = osakaButton.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  showClickEffect(clickX, clickY);

  // Calculate CPS
  let currentTime = Date.now();
  if (lastClickTime) {
    let timeDiff = (currentTime - lastClickTime) / 1000;
    cps = (1 / timeDiff).toFixed(2);
    cpsDisplay.textContent = cps;
  }
  lastClickTime = currentTime;

  checkUpgrades();
  saveGame();
});

// Show Click Effect
function showClickEffect(x, y) {
  clickEffect.style.left = `${x - 50}px`;
  clickEffect.style.top = `${y - 50}px`;
  clickEffect.style.display = 'block';

  // Animate the effect
  clickEffect.classList.remove('click-effect-animate');
  void clickEffect.offsetWidth;  // Reset animation
  clickEffect.classList.add('click-effect-animate');
  
  setTimeout(() => {
    clickEffect.style.display = 'none';
  }, 300);
}

// Upgrade: Increase Click Value
upgradeClickButton.addEventListener('click', () => {
  if (cash >= upgradeClickCost) {
    cash -= upgradeClickCost;
    clickValue += 1;
    upgradeClickCost *= 2;
    upgradeClickButton.textContent = `Increase Click Value (Cost: $${upgradeClickCost})`;
    cashDisplay.textContent = cash;
    checkUpgrades();
    saveGame();
  }
});

// Check for available upgrades
function checkUpgrades() {
  upgradeClickButton.disabled = cash < upgradeClickCost;
}

// Save game data to local storage
function saveGame() {
  const gameData = { score, cash, clickValue, upgradeClickCost };
  localStorage.setItem('osakaClickerSave', JSON.stringify(gameData));
}

// Load game data from local storage
function loadGame() {
  const savedData = localStorage.getItem('osakaClickerSave');
  if (savedData) {
    const { score: savedScore, cash: savedCash, clickValue: savedClickValue, upgradeClickCost: savedUpgradeClickCost } = JSON.parse(savedData);
    score = savedScore;
    cash = savedCash;
    clickValue = savedClickValue;
    upgradeClickCost = savedUpgradeClickCost;
    updateUI();
  }
}

// Update UI after loading game
function updateUI() {
  scoreDisplay.textContent = score;
  cashDisplay.textContent = cash;
  upgradeClickButton.textContent = `Increase Click Value (Cost: $${upgradeClickCost})`;
  checkUpgrades();
}

// Load game on start
loadGame();
