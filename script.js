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
  const scoreDisplay = document.getElementById('score');
  const cashDisplay = document.getElementById('cash');
  const cpsDisplay = document.getElementById('cps');
  const osakaButton = document.getElementById('osaka');
  const clickSound = document.getElementById('click-sound');
  const rebirthSound = document.getElementById('rebirth-sound');
  const feverSound = document.getElementById('fever-sound');
  const clickEffect = document.getElementById('click-effect');
  const backgroundMusic = document.getElementById('background-music');

  // Upgrades
  const upgradeClickButton = document.getElementById('upgrade1');
  const rebirthButton = document.getElementById('rebirth-button');
  const resetButton = document.getElementById('reset-button');

  // Clicking Osaka Button
  osakaButton.addEventListener('click', (e) => {
    score += clickValue;
    cash += clickValue;
    scoreDisplay.textContent = score;
    cashDisplay.textContent = cash;

    // Play click sound
    clickSound.currentTime = 0; // Reset sound to start
    clickSound.play();

    // Change image to osakam.png while clicking
    osakaButton.src = 'osakam.png'; // Click image
    setTimeout(() => {
      osakaButton.src = 'osaka_idle.png'; // Return to idle image after 100ms
    }, 100);

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

    // Fever mode activation
    if (feverMode) {
      score += clickValue; // Double score in fever mode
      cash += clickValue;  // Double cash in fever mode
      feverSound.play(); // Play fever sound
    }

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

  // Rebirth
  rebirthButton.addEventListener('click', () => {
    if (cash >= rebirthCost) {
      cash -= rebirthCost;
      rebirths += 1;
      score = 0; // Reset score on rebirth
      clickValue = Math.floor(clickValue * 1.5); // Increase click value on rebirth
      rebirthCost *= 2; // Increase rebirth cost
      rebirthSound.play();
      alert(`Rebirth successful! Total Rebirths: ${rebirths}`);

      cashDisplay.textContent = cash;
      scoreDisplay.textContent = score;
      rebirthButton.textContent = `Rebirth (Cost: $${rebirthCost})`;
      checkUpgrades();
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

      scoreDisplay.textContent = score;
      cashDisplay.textContent = cash;
      cpsDisplay.textContent = cps;
      rebirthButton.textContent = `Rebirth (Cost: $${rebirthCost})`;
      backgroundMusic.currentTime = 0; // Reset music
      backgroundMusic.play(); // Play background music again
      checkUpgrades();
      saveGame();
    }
  });

  // Upgrades
  upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
      cash -= upgradeClickCost;
      clickValue += 1; // Increase click value
      upgradeClickCost *= 2; // Increase cost for next upgrade
      alert('Click value increased!');

      cashDisplay.textContent = cash;
      checkUpgrades();
      saveGame();
    }
  });

  // Check Upgrades
  function checkUpgrades() {
    upgradeClickButton.disabled = cash < upgradeClickCost;
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
      scoreDisplay.textContent = score;
      cashDisplay.textContent = cash;
      rebirthButton.textContent = `Rebirth (Cost: $${rebirthCost})`;
      checkUpgrades();
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
        scoreDisplay.textContent = score;
        cashDisplay.textContent = cash;
        rebirthButton.textContent = `Rebirth (Cost: $${rebirthCost})`;
        checkUpgrades();
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

  // Load game on page load
  window.onload = loadGame();

  // Background music play
  backgroundMusic.play();
});
