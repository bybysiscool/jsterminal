let score = 0;
let upgradeCost = 10;
let clickValue = 1;

const scoreDisplay = document.getElementById('score');
const osakaButton = document.getElementById('osaka');
const upgradeButton = document.getElementById('upgrade-button');

osakaButton.addEventListener('click', () => {
  score += clickValue;
  scoreDisplay.textContent = score;
  checkUpgrade();
});

upgradeButton.addEventListener('click', () => {
  if (score >= upgradeCost) {
    score -= upgradeCost;
    clickValue += 1;
    upgradeCost *= 2;
    upgradeButton.textContent = `Buy Upgrade (Cost: ${upgradeCost})`;
    scoreDisplay.textContent = score;
    checkUpgrade();
  }
});

function checkUpgrade() {
  if (score >= upgradeCost) {
    upgradeButton.disabled = false;
  } else {
    upgradeButton.disabled = true;
  }
}
