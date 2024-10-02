let score = 0;
let cash = 0;
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
const cashDisplay = document.getElementById('cash');
const cpsDisplay = document.getElementById('cps');
const osakaButton = document.getElementById('osaka');
const clickSound = document.getElementById('click-sound');
const clickEffect = document.getElementById('click-effect');

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
osakaButton.addEventListener('click', (e) => {
  score += clickValue;
  cash += clickValue;
  scoreDisplay.textContent = score;
  cashDisplay.textContent = cash;

  // Play click sound
  clickSound.play();

  // Show click effect
  const clickX = e.clientX;
  const clickY = e.clientY;
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
  setTimeout(() => {
    clickEffect.style.display = 'none';
  }, 200);
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

// Auto Clicker
autoClickButton.addEventListener('click', () => {
  if (cash >= autoClickCost) {
    cash -= autoClickCost;
    autoClickActive = true;
    autoClickCost *= 2;
    autoClickButton.textContent = `Auto Clicker (Cost: $${autoClickCost})`;
    cashDisplay.textContent = cash;
    startAutoClicker();
    checkUpgrades();
    saveGame();
  }
});

// Export Data
exportButton.addEventListener('click', () => {
  const data = JSON.stringify({ score, cash, clickValue, upgradeClickCost });
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
    cash = data.cash;
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
      cash += clickValue;
      scoreDisplay.textContent = score;
      cashDisplay.textContent = cash;
      checkUpgrades();
      saveGame();
    }, interval);
  }
}

// Check available upgrades
function checkUpgrades() {
  upgradeClickButton.disabled = cash < upgradeClickCost;
  autoClickButton.disabled = cash < autoClickCost;
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
    updateUI​⬤
