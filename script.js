document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  let cash = 0;
  let clickValue = 1;
  let upgradeClickCost = 10;
  let rebirthCost = 1000;
  let autoclickerActive = false;
  let autoclickerInterval = null;
  let hasInteracted = false;

  // Selectors
  const scoreDisplay = document.getElementById('score');
  const cashDisplay = document.getElementById('cash');
  const osakaButton = document.getElementById('osaka');
  const upgradeClickButton = document.getElementById('upgrade1');
  const autoclickerButton = document.getElementById('autoclicker');
  const upgradeCPSButton = document.getElementById('upgradeCPS');
  const rebirthButton = document.getElementById('rebirth-button');
  const resetButton = document.getElementById('reset-button');
  const clickSound = document.getElementById('click-sound');
  const rebirthSound = document.getElementById('rebirth-sound');
  const backgroundMusic = document.getElementById('background-music');

  // Function to start music on first user interaction
  function startMusic() {
    if (!hasInteracted) {
      backgroundMusic.play().catch(error => console.log('Autoplay prevented:', error));
      hasInteracted = true;
      document.removeEventListener('click', startMusic);
    }
  }

  // Wait for user interaction before playing music
  document.addEventListener('click', startMusic);

  // Load Game from LocalStorage
  function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('osaka_clicker'));
    if (savedGame) {
      score = savedGame.score;
      cash = savedGame.cash;
      clickValue = savedGame.clickValue;
      upgradeClickCost = savedGame.upgradeClickCost;
      rebirthCost = savedGame.rebirthCost;
      autoclickerActive = savedGame.autoclickerActive || false;

      if (autoclickerActive) {
        startAutoclicker();
      }

      updateUI();
    }
  }

  // Save Game to LocalStorage
  function saveGame() {
    localStorage.setItem('osaka_clicker', JSON.stringify({
      score,
      cash,
      clickValue,
      upgradeClickCost,
      rebirthCost,
      autoclickerActive
    }));
  }

  // Update UI
  function updateUI() {
    scoreDisplay.textContent = score;
    cashDisplay.textContent = cash;
    upgradeClickButton.disabled = cash < upgradeClickCost;
    autoclickerButton.disabled = autoclickerActive || cash < 50;
    upgradeCPSButton.disabled = cash < 100;
    rebirthButton.disabled = cash < rebirthCost;
  }

  // Clicking Osaka Button
  osakaButton.addEventListener('click', () => {
    score += clickValue;
    cash += clickValue;
    updateUI();
    
    clickSound.currentTime = 0;
    clickSound.play();
    
    saveGame();
  });

  // Upgrade Click Value
  upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
      cash -= upgradeClickCost;
      clickValue += 1;
      upgradeClickCost *= 2;
      updateUI();
      saveGame();
    }
  });

  // Buy Autoclicker
  autoclickerButton.addEventListener('click', () => {
    if (cash >= 50 && !autoclickerActive) {
      cash -= 50;
      autoclickerActive = true;
      startAutoclicker();
      updateUI();
      saveGame();
    }
  });

  // Start Autoclicker
  function startAutoclicker() {
    autoclickerInterval = setInterval(() => {
      score += 1;
      cash += 1;
      updateUI();
      saveGame();
    }, 1000);
  }

  // Upgrade CPS
  upgradeCPSButton.addEventListener('click', () => {
    if (cash >= 100) {
      cash -= 100;
      updateUI();
      saveGame();
    }
  });

  // Rebirth
  rebirthButton.addEventListener('click', () => {
    if (cash >= rebirthCost) {
      cash -= rebirthCost;
      score = 0;
      clickValue = Math.floor(clickValue * 1.5);
      rebirthCost *= 2;
      rebirthSound.play();
      updateUI();
      saveGame();
    }
  });

  // Reset Game
  resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data?')) {
      localStorage.removeItem('osaka_clicker');
      location.reload();
    }
  });

  loadGame();
});
