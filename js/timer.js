/**
 * ==========================================================================
 * Cognitio - Pomodoro Focus Timer Engine
 * Course: Web Technologies (BS CS F24) - Assignment 01
 * Instructor: Dr. Noman Shafi
 * Description: Real-time countdown timer with circular SVG progress animation,
 *              Web Audio API chime synthesis, streak tracking, and session logging.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initFocusTimer();
});

// Timer Configurations
const CIRCLE_CIRCUMFERENCE = 722.56; // 2 * PI * 115

const MODE_CONFIG = {
  pomodoro: { name: 'Deep Focus', defaultMins: 25, color: '#2997ff' },
  shortBreak: { name: 'Short Break', defaultMins: 5, color: '#30d158' },
  longBreak: { name: 'Long Recovery', defaultMins: 15, color: '#bf5af2' }
};

// Global Timer State
let currentMode = 'pomodoro';
let totalDurationSeconds = 25 * 60;
let remainingSeconds = 25 * 60;
let isTimerActive = false;
let countdownInterval = null;
let completedCycleCount = 0;
let soundEnabled = true;
let sessionLogs = [];

/**
 * Main initialization entry point.
 */
function initFocusTimer() {
  loadTimerHistory();
  setupModeButtons();
  setupControls();
  setupPresetButtons();
  setupSoundToggle();
  setupLogClear();
  
  // Initial Display
  updateTimerUI();
  renderSessionLogs();
  updateStreakDisplay();
}

/**
 * Setup Pomodoro / Short Break / Long Break segmented buttons.
 */
function setupModeButtons() {
  const modeButtons = document.querySelectorAll('.timer-mode-btn');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-mode');
      if (targetMode === currentMode) return;

      // Switch active class
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      switchTimerMode(targetMode);
    });
  });
}

function switchTimerMode(modeKey, customMins = null) {
  // Pause any currently running timer
  pauseTimer();

  currentMode = modeKey;
  const config = MODE_CONFIG[modeKey];
  const mins = customMins || config.defaultMins;

  totalDurationSeconds = mins * 60;
  remainingSeconds = totalDurationSeconds;

  // Update SVG stroke color based on mode
  const circle = document.getElementById('timerProgressCircle');
  if (circle) {
    circle.style.stroke = config.color;
  }

  // Update Status Badge
  const badge = document.getElementById('timerStatusBadge');
  if (badge) {
    badge.textContent = config.name;
    badge.style.color = config.color;
  }

  // Update preset pills active state if pomodoro
  if (modeKey === 'pomodoro') {
    updatePresetPillActive(mins);
  }

  updateTimerUI();
}

/**
 * Setup Play/Pause, Reset, and Skip controls.
 */
function setupControls() {
  const toggleBtn = document.getElementById('toggleTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const skipBtn = document.getElementById('skipTimerBtn');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isTimerActive) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetTimer();
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      skipTimer();
    });
  }
}

/**
 * Start the interval countdown.
 */
function startTimer() {
  if (isTimerActive) return;

  isTimerActive = true;
  updateControlButtonsUI();

  // Tick every second
  countdownInterval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      isTimerActive = false;
      remainingSeconds = 0;
      updateTimerUI();
      handleTimerCompletion();
    } else {
      updateTimerUI();
    }
  }, 1000);

  if (window.showToast) {
    window.showToast(`${MODE_CONFIG[currentMode].name} started. Stay in the zone.`, 'info');
  }
}

/**
 * Pause the countdown.
 */
function pauseTimer() {
  if (!isTimerActive) return;

  isTimerActive = false;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  updateControlButtonsUI();
}

/**
 * Reset to the initial mode duration.
 */
function resetTimer() {
  pauseTimer();
  remainingSeconds = totalDurationSeconds;
  updateTimerUI();
}

/**
 * Skip forward to the next logical mode.
 */
function skipTimer() {
  pauseTimer();
  if (currentMode === 'pomodoro') {
    // Switch to break
    if ((completedCycleCount + 1) % 4 === 0) {
      setModeButtonActive('longBreak');
      switchTimerMode('longBreak');
    } else {
      setModeButtonActive('shortBreak');
      switchTimerMode('shortBreak');
    }
  } else {
    // Switch back to pomodoro
    setModeButtonActive('pomodoro');
    switchTimerMode('pomodoro');
  }
}

/**
 * Called when the timer naturally counts down to 00:00.
 */
function handleTimerCompletion() {
  updateControlButtonsUI();

  // 1. Play Synthesized Chime Audio
  if (soundEnabled) {
    playSynthesizedChime();
  }

  // 2. Handle Cycle Count and Logging
  if (currentMode === 'pomodoro') {
    completedCycleCount = (completedCycleCount + 1) % 5;
    if (completedCycleCount === 0) completedCycleCount = 1;

    updateStreakDisplay();
    logSession(`Completed ${Math.round(totalDurationSeconds / 60)}m Focus Sprint`);

    if (window.showToast) {
      window.showToast('Sprint complete! Time for a well-deserved break.', 'success');
    }

    // Auto prompt next interval
    if (completedCycleCount === 4) {
      setModeButtonActive('longBreak');
      switchTimerMode('longBreak');
    } else {
      setModeButtonActive('shortBreak');
      switchTimerMode('shortBreak');
    }
  } else {
    logSession(`Completed ${Math.round(totalDurationSeconds / 60)}m Rest Period`);
    if (window.showToast) {
      window.showToast('Break finished! Ready to resume focus?', 'info');
    }
    setModeButtonActive('pomodoro');
    switchTimerMode('pomodoro');
  }
}

/**
 * Update the circular SVG ring and digital MM:SS clock.
 */
function updateTimerUI() {
  const display = document.getElementById('timerDisplay');
  const progressCircle = document.getElementById('timerProgressCircle');

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (display) {
    display.textContent = formattedTime;
  }

  // Update browser tab title
  document.title = `${formattedTime} — ${MODE_CONFIG[currentMode].name} | Cognitio`;

  // Animate SVG circular progress
  if (progressCircle && totalDurationSeconds > 0) {
    const fraction = (totalDurationSeconds - remainingSeconds) / totalDurationSeconds;
    const offset = CIRCLE_CIRCUMFERENCE * fraction;
    progressCircle.style.strokeDashoffset = offset;
  }
}

function updateControlButtonsUI() {
  const toggleIconPlay = document.getElementById('toggleIconPlay');
  const toggleIconPause = document.getElementById('toggleIconPause');
  const toggleBtnText = document.getElementById('toggleBtnText');

  if (isTimerActive) {
    if (toggleIconPlay) toggleIconPlay.style.display = 'none';
    if (toggleIconPause) toggleIconPause.style.display = 'block';
    if (toggleBtnText) toggleBtnText.textContent = 'Pause Focus';
  } else {
    if (toggleIconPlay) toggleIconPlay.style.display = 'block';
    if (toggleIconPause) toggleIconPause.style.display = 'none';
    if (toggleBtnText) toggleBtnText.textContent = remainingSeconds < totalDurationSeconds ? 'Resume' : 'Start Focus';
  }
}

function setModeButtonActive(modeKey) {
  const modeButtons = document.querySelectorAll('.timer-mode-btn');
  modeButtons.forEach(btn => {
    if (btn.getAttribute('data-mode') === modeKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Quick Preset Intervals (25m, 45m, 50m, 60m).
 */
function setupPresetButtons() {
  const presetPills = document.querySelectorAll('.preset-pill');

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mins = parseInt(pill.getAttribute('data-mins'), 10);
      setModeButtonActive('pomodoro');
      switchTimerMode('pomodoro', mins);
      updatePresetPillActive(mins);
    });
  });
}

function updatePresetPillActive(mins) {
  const presetPills = document.querySelectorAll('.preset-pill');
  presetPills.forEach(p => {
    const pMins = parseInt(p.getAttribute('data-mins'), 10);
    if (pMins === mins) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

/**
 * Update 4-cycle streak visual indicator dots.
 */
function updateStreakDisplay() {
  const dots = [
    document.getElementById('streakDot1'),
    document.getElementById('streakDot2'),
    document.getElementById('streakDot3'),
    document.getElementById('streakDot4')
  ];

  dots.forEach((dot, index) => {
    if (dot) {
      if (index < completedCycleCount) {
        dot.classList.add('completed');
      } else {
        dot.classList.remove('completed');
      }
    }
  });

  const text = document.getElementById('streakCountText');
  if (text) {
    text.textContent = `${completedCycleCount}/4 Completed`;
  }
}

/**
 * Web Audio API Chime Synthesis.
 * Generates an authentic Cupertino harmonic chime without external sound files.
 */
function playSynthesizedChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Frequency sequence: C5 (523.25 Hz) then E5 (659.25 Hz)
    const tones = [523.25, 659.25];
    const now = ctx.currentTime;

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0.001, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.85);
    });
  } catch (e) {
    console.warn('Web Audio synthesis error:', e);
  }
}

/**
 * Audio Toggle Button.
 */
function setupSoundToggle() {
  const toggleBtn = document.getElementById('soundToggleBtn');
  const iconOn = document.getElementById('soundIconOn');
  const iconOff = document.getElementById('soundIconOff');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      if (iconOn) iconOn.style.display = 'block';
      if (iconOff) iconOff.style.display = 'none';
      if (window.showToast) window.showToast('Audio chimes enabled.', 'info');
      // Test chime
      playSynthesizedChime();
    } else {
      if (iconOn) iconOn.style.display = 'none';
      if (iconOff) iconOff.style.display = 'block';
      if (window.showToast) window.showToast('Audio chimes muted.', 'info');
    }
  });
}

/**
 * Session Activity Logger & LocalStorage Persistence.
 */
function logSession(description) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const logEntry = {
    id: Date.now(),
    desc: description,
    time: timeStr
  };

  sessionLogs.unshift(logEntry);
  if (sessionLogs.length > 8) sessionLogs.pop(); // Keep recent 8

  saveTimerHistory();
  renderSessionLogs();
}

function renderSessionLogs() {
  const logList = document.getElementById('focusLogList');
  const emptyLog = document.getElementById('emptyLogState');

  if (!logList) return;

  if (sessionLogs.length === 0) {
    if (emptyLog) emptyLog.style.display = 'block';
    return;
  }

  if (emptyLog) emptyLog.style.display = 'none';

  // Render items
  logList.innerHTML = '';
  sessionLogs.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'focus-log-item';
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--apple-green);"></span>
        <span>${escapeHtml(entry.desc)}</span>
      </div>
      <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(entry.time)}</span>
    `;
    logList.appendChild(item);
  });
}

function setupLogClear() {
  const clearBtn = document.getElementById('clearLogBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      sessionLogs = [];
      completedCycleCount = 0;
      saveTimerHistory();
      renderSessionLogs();
      updateStreakDisplay();
      if (window.showToast) window.showToast('Session history reset.', 'info');
    });
  }
}

function loadTimerHistory() {
  try {
    const stored = localStorage.getItem('cognitio_focus_logs');
    sessionLogs = stored ? JSON.parse(stored) : [];
  } catch (e) {
    sessionLogs = [];
  }
}

function saveTimerHistory() {
  try {
    localStorage.setItem('cognitio_focus_logs', JSON.stringify(sessionLogs));
  } catch (e) {}
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
