(() => {
  const pads = Array.from(document.querySelectorAll('.pad'));
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const messageEl = document.getElementById('message');

  let sequence = [];          
  let userIndex = 0;           
  let level = 0;
  let score = 0;
  let acceptingInput = false;  
  let isRunning = false;  

  const COLORS = ['red','green','yellow','blue'];

  function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function flashPad(color, duration = 360) {
    const pad = pads.find(p => p.dataset.color === color);
    if (!pad) return;
    pad.classList.add('flash');
    setTimeout(() => pad.classList.remove('flash'), duration);
  }

  function setMessage(text, tone = 'neutral') {
    messageEl.textContent = text;
    if (tone === 'error') messageEl.style.color = '#d9534f';
    else messageEl.style.color = '';
  }

  function updateUI() {
    levelEl.textContent = level > 0 ? level : '—';
    scoreEl.textContent = score;
  }
  function resetGame() {
    sequence = [];
    userIndex = 0;
    level = 0;
    score = 0;
    acceptingInput = false;
    isRunning = false;
    startBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    document.querySelector(".hint").textContent = "Press any key or Click Start Game to play";
    setMessage('');
    updateUI();
  }

  function startNewGame() {
    if (isRunning) return;
    isRunning = true;
    document.querySelector(".hint").textContent = "";
    startBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');

    sequence = [];
    level = 0;
    score = 0;
    nextRound();

  }

  function nextRound() {
    level++;
    setMessage('Watch the sequence');
    acceptingInput = false;
    userIndex = 0;
    sequence.push(getRandomColor());
    updateUI();
    playSequence(sequence);
  }

  function playSequence(seq) {
    let delay = 0;
    seq.forEach((color) => {
      setTimeout(() => flashPad(color), delay);
      delay += 520;
    });

    setTimeout(() => {
      acceptingInput = true;
      setMessage('Your turn — repeat the sequence');
    }, delay);
  }

  function handleUserInput(color) {
    if (!acceptingInput) return;

    flashPad(color, 180);

    if (color === sequence[userIndex]) {
      userIndex++;
      if (userIndex === sequence.length) {
        score += sequence.length; 
        acceptingInput = false;
        setMessage('Good — next round incoming!');
        updateUI();
        setTimeout(nextRound, 800);
      } else {
      
        setMessage('Keep going...');
      }
    } else {
      gameOver();
    }
  }

  function gameOver() {
    acceptingInput = false;
    isRunning = false;
    setMessage(`Wrong! Game over. You reached level ${level} — Score ${score}`, 'error');
    restartBtn.classList.remove('hidden');
    startBtn.classList.add('hidden');
  }

  pads.forEach(pad => {
    pad.addEventListener('click', (e) => {
      const color = pad.dataset.color;
      if (!acceptingInput) return;
      handleUserInput(color);
    });
    pad.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pad.click();
      }
    });
  });

  startBtn.addEventListener('click', () => startNewGame());
  restartBtn.addEventListener('click', () => resetGame());

  window.addEventListener('keydown', (e) => {
    if (!isRunning && sequence.length === 0) {
      startNewGame();
    }
  });
  document.getElementById('board').addEventListener('click', (e) => {
    const pad = e.target.closest('.pad');
    if (!pad) return;
    if (!acceptingInput) {
      const color = pad.dataset.color;
      flashPad(color, 160);
    }
  });
  resetGame();

})();
