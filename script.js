document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  let cash = 0;
  let clickValue = 1;
  let upgradeClickCost = 10;
  let rebirthCost = 1000;

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

  // Load Game from LocalStorage
  function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('osaka_clicker'));
    if (savedGame) {
      score = savedGame.score;
      cash = savedGame.cash;
      clickValue = savedGame.clickValue;
      upgradeClickCost = savedGame.upgradeClickCost;
      rebirthCost = savedGame.rebirthCost;
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
      rebirthCost
    }));
  }

  // Update UI
  function updateUI() {
    scoreDisplay.textContent = score;
    cashDisplay.textContent = cash;
    upgradeClickButton.disabled = cash < upgradeClickCost;
    autoclickerButton.disabled = cash < 50;
    upgradeCPSButton.disabled = cash < 100;
    rebirthButton.disabled = cash < rebirthCost;
  }

  // Clicking Osaka Button
  osakaButton.addEventListener('click', () => {
    score += clickValue;
    cash += clickValue;
    updateUI();
    
    // Play click sound
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
    if (cash >= 50) {
      cash -= 50;
      updateUI();
      alert('Autoclicker activated!');
      setInterval(() => {
        score += 1;
        cash += 1;
        updateUI();
        saveGame();
      }, 1000);
    }
  });

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
    if (confirm('Are you sure you want to reset?')) {
      score = 0;
      cash = 0;
      clickValue = 1;
      upgradeClickCost = 10;
      rebirthCost = 1000;
      updateUI();
      saveGame();
    }
  });

  // Start Background Music
  backgroundMusic.play();

  // Load saved game data
  loadGame();
});
