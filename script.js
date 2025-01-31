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

  // Clicking Osaka Button
  osakaButton.addEventListener('click', (e) => {
    score += clickValue;
    cash += clickValue;
    scoreDisplay.textContent = score;
    cashDisplay.textContent = cash;

    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // Change image briefly
    osakaButton.src = 'osakam.png';
    setTimeout(() => {
      osakaButton.src = 'osaka_idle.png';
    }, 100);

    // Show new floating click effect
    createClickEffect(e.clientX, e.clientY, `+${clickValue}`);

    // Calculate CPS
    let currentTime = Date.now();
    if (lastClickTime) {
      let timeDiff = (currentTime - lastClickTime) / 1000;
      cps = (1 / timeDiff).toFixed(2);
      cpsDisplay.textContent = cps;
    }
    lastClickTime = currentTime;

    // Fever mode activation
    if (feverMode) {
      score += clickValue;
      cash += clickValue;
      feverSound.play();
    }

    updateButtonPrices();
    saveGame();
  });

  // Improved Click Effect Function
  function createClickEffect(x, y, text) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = text;
    document.body.appendChild(effect);

    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    setTimeout(() => {
      effect.style.opacity = '0';
      effect.style.transform = 'translateY(-50px)';
    }, 100);

    setTimeout(() => {
      effect.remove();
    }, 500);
  }

  // Autoclicker Logic
  let autoclickerActive = false;
  autoclickerButton.addEventListener('click', () => {
    if (cash >= 50) {
      cash -= 50;
      autoclickerActive = true;
      alert('Autoclicker activated!');
      setInterval(() => {
        score += 1;
        cash += 1;
        scoreDisplay.textContent = score;
        cashDisplay.textContent = cash;
      }, 1000);
      updateButtonPrices();
      saveGame();
    }
  });

  // Upgrade CPS
  upgradeCPSButton.addEventListener('click', () => {
    if (cash >= 100) {
      cash -= 100;
      cps += 1;
      alert('CPS upgraded!');
      updateButtonPrices();
      saveGame();
    }
  });

  // Rebirth
  rebirthButton.addEventListener('click', () => {
    if (cash >= rebirthCost) {
      cash -= rebirthCost;
      rebirths += 1;
      score = 0;
      clickValue = Math.floor(clickValue * 1.5);
      rebirthCost *= 2;
      rebirthSound.play();
      alert(`Rebirth successful! Total Rebirths: ${rebirths}`);
      updateButtonPrices();
      saveGame();
    }
  });

  // Reset Data
  resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data?')) {
      score = 0;
      cash = 0;
      clickValue = 1;
      upgradeClickCost = 10;
      rebirthCost = 1000;
      rebirths = 0;
      feverMode = false;
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
      updateButtonPrices();
      saveGame();
    }
  });

  // Upgrade Click Value
  upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
      cash -= upgradeClickCost;
      clickValue += 1;
      upgradeClickCost *= 2;
      alert('Click value increased!');
      updateButtonPrices();
      saveGame();
    }
  });

  // Update Button Prices Dynamically
  function updateButtonPrices() {
    upgradeClickButton.textContent = `Upgrade Click ($${upgradeClickCost})`;
    rebirthButton.textContent = `Rebirth ($${rebirthCost})`;

    upgradeClickButton.disabled = cash < upgradeClickCost;
    autoclickerButton.disabled = autoclickerActive;
    upgradeCPSButton.disabled = cash < 100;
    rebirthButton.disabled = cash < rebirthCost;
  }

  // Save Game
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

  // Load Game
  function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('osaka_clicker'));
    if (savedGame) {
      score = savedGame.score;
      cash = savedGame.cash;
      clickValue = savedGame.clickValue;
      upgradeClickCost = savedGame.upgradeClickCost;
      rebirthCost = savedGame.rebirthCost;
      rebirths = savedGame.rebirths;
      updateButtonPrices();
    }
  }

  // Import Data
  document.getElementById('import-button').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const importedData = JSON.parse(e.target.result);
        score = importedData.score;
        cash = importedData.cash;
        clickValue = importedData.clickValue;
        upgradeClickCost = importedData.upgradeClickCost;
        rebirthCost = importedData.rebirthCost;
        rebirths = importedData.rebirths;
        updateButtonPrices();
      };
      reader.readAsText(file);
    };
  });

  // Export Data
  document.getElementById('export-button').addEventListener('click', () => {
    const gameData = { score, cash, clickValue, upgradeClickCost, rebirthCost, rebirths };
    const jsonData = JSON.stringify(gameData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'osaka_clicker_save.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  loadGame();
  backgroundMusic.play();
});
