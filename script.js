document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  let cash = 0;
  let clickValue = 1;
  let upgradeClickCost = 10;
  let lastClickTime = 0;
  let cps = 0;

  // Rebirth variables
  let rebirthCost = 1000;
  let rebirths = 0;
  let feverMode = false;

  // Selectors
  const titleDisplay = document.getElementById('title');
  const scoreDisplay = document.getElementById('score');
  const cashDisplay = document.getElementById('cash');
  const cpsDisplay = document.getElementById('cps');
  const osakaButton = document.getElementById('osaka');
  const clickSound = document.getElementById('click-sound');
  const rebirthSound = document.getElementById('rebirth-sound');
  const feverSound = document.getElementById('fever-sound');
  const backgroundMusic = document.getElementById('background-music');

  // Upgrades
  const upgradeClickButton = document.getElementById('upgrade1');
  const autoclickerButton = document.getElementById('autoclicker');
  const upgradeCPSButton = document.getElementById('upgradeCPS');
  const rebirthButton = document.getElementById('rebirth-button');
  const resetButton = document.getElementById('reset-button');
  const clickEffectContainer = document.getElementById('click-effect-container');

  // Clicking Osaka Button
  osakaButton.addEventListener('click', (e) => {
    score += clickValue;
    cash += clickValue;
    scoreDisplay.textContent = score;
    cashDisplay.textContent = cash;

    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // Click effect
    showClickEffect(e.clientX, e.clientY);

    // Fever mode activation
    if (feverMode) {
      score += clickValue;
      cash += clickValue;
      feverSound.play();
    }

    checkUpgrades();
    saveGame();
  });

  // Improved Click Effect
  function showClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.classList.add('click-effect');
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    clickEffectContainer.appendChild(effect);

    setTimeout(() => {
      effect.style.opacity = '0';
      effect.style.transform = 'scale(1.5)';
    }, 50);

    setTimeout(() => {
      effect.remove();
    }, 500);
  }

  // Check Upgrades
  function checkUpgrades() {
    upgradeClickButton.disabled = cash < upgradeClickCost;
    autoclickerButton.disabled = cash < 50;
    upgradeCPSButton.disabled = cash < 100;
    rebirthButton.disabled = cash < rebirthCost;

    upgradeClickButton.textContent = `Upgrade Click ($${upgradeClickCost})`;
    autoclickerButton.textContent = `Autoclicker ($50)`;
    upgradeCPSButton.textContent = `Upgrade CPS ($100)`;
    rebirthButton.textContent = `Rebirth ($${rebirthCost})`;
  }

  // Save and Load Game
  function saveGame() {
    localStorage.setItem('osaka_clicker', JSON.stringify({
      score,
      cash,
      clickValue,
      upgradeClickCost,
      rebirthCost,
      rebirths
    }));
  }

  function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('osaka_clicker'));
    if (savedGame) {
      score = savedGame.score;
      cash = savedGame.cash;
      clickValue = savedGame.clickValue;
      upgradeClickCost = savedGame.upgradeClickCost;
      rebirthCost = savedGame.rebirthCost;
      rebirths = savedGame.rebirths;
      checkUpgrades();
    }
  }

  loadGame();
  backgroundMusic.play();
});
