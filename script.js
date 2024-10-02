let score = 0;
let clickValue = 1;
let upgradeClickCost = 10;
let autoClickCost = 100;
let multiplierCost = 500;
let autoClickSpeedCost = 1000;
let autoClickActive = false;
let multiplierActive = false;

const scoreDisplay = document.getElementById('score');
const osakaButton = document.getElementById('osaka');

// Upgrades
const upgradeClickButton = document.getElementById('upgrade1');
const autoClickButton = document.getElementById('upgrade2');
const multiplierButton = document.getElementById('upgrade3');
const autoClickSpeedButton = document.getElementById('upgrade4');

// Click Osaka Button
osakaButton.addEventListener('click', () => {
  score += clickValue;
  scoreDisplay.textContent = score;
  checkUpgrades();
});

// Upgrade: Increase Click Value
upgradeClickButton.addEventListener('click', () => {
  if (score >= upgradeClickCost) {
    score -= upgradeClickCost;
    clickValue += 1;
    upgradeClickCost *= 2;  // Cost doubles each upgrade
    upgradeClickButton.textContent = `Increase Click Value (Cost: ${upgradeClickCost})`;
    scoreDisplay.textContent = score;
    checkUpgrades();
  }
});

// Upgrade: Auto Clicker
autoClickButton.addEventListener('click', () => {
  if (score >= autoClickCost) {
    score -= autoClickCost;
    autoClickActive = true;
    autoClickCost *= 2;
    autoClickButton.textContent = `Auto Clicker (Cost: ${autoClickCost})`;
    scoreDisplay.textContent = score;
    startAutoClicker();
    checkUpgrades();
  }
});

// Upgrade: Multiplier (Doubles click value)
multiplierButton.addEventListener('click', () => {
  if (score >= multiplierCost) {
    score -= multiplierCost;
    clickValue *= 2;  // Doubles the click value
    multiplierCost *= 2;
    multiplierButton.textContent = `Multiplier (Cost: ${multiplierCost})`;
    scoreDisplay.textContent = score;
    checkUpgrades();
  }
});

// Upgrade: Auto Clicker Speed Upgrade
autoClickSpeedButton.addEventListener('click', () => {
  if (score >= autoClickSpeedCost) {
    score -= autoClickSpeedCost;
    autoClickSpeedCost *= 2;
    autoClickSpeedButton.textContent = `Auto Clicker Speed Upgrade (Cost: ${autoClickSpeedCost})`;
    scoreDisplay.textContent = score;
    startAutoClicker(500);  // Increase the speed of auto clicks
    checkUpgrades();
  }
});

// Auto Clicker Function
function startAutoClicker(interval = 1000) {
  if (autoClickActive) {
    setInterval(() => {
      score += clickValue;
      scoreDisplay.textContent = score;
      checkUpgrades();
    }, interval);
  }
}

// Check available upgrades
function checkUpgrades() {
  // Enable or disable upgrade buttons based on score
  upgradeClickButton.disabled = score < upgradeClickCost;
  autoClickButton.disabled = score < autoClickCost;
  multiplierButton.disabled = score < multiplierCost;
  autoClickSpeedButton.disabled = score < autoClickSpeedCost;
}
