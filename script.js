let score = 0;
let clickValue = 1;
let upgradeClickCost = 10;
let autoClickCost = 100;
let multiplierCost = 500;
let autoClickSpeedCost = 1000;
let autoClickActive = false;
let multiplierActive = false;
let lastClickTime = 0;
let cps = 0;

// Selectors
const scoreDisplay = document.getElementById('score');
const cpsDisplay = document.getElementById('cps');
const osakaButton = document.getElementById('osaka');
const clickSound = document.getElementById('click-sound');

// Upgrades
const upgradeClickButton = document.getElementById('upgrade1');
const autoClickButton = document.getElementById('upgrade2');
const multiplierButton = document.getElementById('upgrade3');
const autoClickSpeedButton = document.getElementById('upgrade4');

// Export/Import
const exportButton = document.getElementById('export-button');
const importButton = document.getElementById('import-button');
const fileInput = document.getElementById('file-input');

// Click Osaka Button
osakaButton.addEventListener('click', () => {
  score += clickValue;
  scoreDisplay.textContent = score;

  // Play click sound
  clickSound.play();

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

// Upgrade: Increase Click Value
upgradeClickButton.addEventListener('click', () => {
  if (score >= upgradeClickCost) {
    score -= upgradeClickCost;
    clickValue += 1;
    upgradeClickCost *= 2;
    upgradeClickButton.textContent = `Increase Click Value (Cost: ${upgradeClickCost})`;
    scoreDisplay.textContent = score;
    checkUpgrades();
    saveGame();
  }
});

// Auto Clicker
autoClickButton.addEventListener('click', () => {
  if (score >= autoClickCost) {
    score -= autoClickCost;
    autoClickActive = true;
    autoClickCost *= 2;
    autoClickButton.textContent = `Auto Clicker (Cost: ${autoClickCost})`;
    scoreDisplay.textContent = score;
    startAutoClicker();
    checkUpgrades();
    saveGame();
  }
});

// Export Data
exportButton.addEventListener('click', () => {
  const data = JSON.stringify({ score, clickValue, upgradeClickCost });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'osaka_clicker_save.json';
  a.click();
});

// Import Data
importButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    score = data.score;
    clickValue = data.clickValue;
    upgradeClickCost = data.upgradeClickCost;
    updateUI();
  };
  reader.readAsText(file);
});

// Auto Clicker Function
function startAutoClicker(interval = 1000) {
  if (autoClickActive) {
    setInterval(() => {
      score += clickValue;
      scoreDisplay.textContent = score;
      checkUpgrades();
      saveGame();
    }, interval);
  }
}

// Check available upgrades
function checkUpgrades() {
  upgradeClickButton.disabled = score < upgradeClickCost;
  autoClickButton.disabled = score < autoClickCost;
}

// Save game data to local storage
function saveGame() {
  const gameData = { score, clickValue, upgradeClickCost };
  localStorage.setItem('osakaClickerSave', JSON.stringify(gameData));
}

// Load game data from local storage
function loadGame() {
  const savedData = localStorage.getItem('osakaClickerSave');
  if (savedData) {
    const { score: savedScore, clickValue: savedClickValue, upgradeClickCost: savedUpgradeClickCost } = JSON.parse(savedData);
    score = savedScore;
    clickValue = savedClickValue;
    upgradeClickCost = savedUpgradeClickCost;
    updateUI();
  }
}

// Update UI after loading game
function updateUI() {
  scoreDisplay.textContent = score;
  upgradeClickButton.textContent = `Increase Click Value (Cost: ${upgradeClickCost})`;
  checkUpgrades();
}

// Load game on start
loadGame();
