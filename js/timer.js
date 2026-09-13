/**
 * Cognitio - Pomodoro Focus Timer Script
 * Simple countdown timer with start, pause, reset, and mode switching.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTimer();
});

function setupTimer() {
  // Timer State Variables
  let timeLeft = 25 * 60; // default 25 minutes in seconds
  let currentModeTime = 25 * 60;
  let timerInterval = null;

  // DOM Elements
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const modeButtons = document.querySelectorAll('.timer-mode-btn');

  if (!display) return;

  // Function to format seconds into MM:SS format
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    display.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }

  // Start the countdown
  function startTimer() {
    if (timerInterval !== null) return; // already running

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Time is up! Great focus session.');
      }
    }, 1000);
  }

  // Pause the countdown
  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Reset to current mode duration
  function resetTimer() {
    pauseTimer();
    timeLeft = currentModeTime;
    updateDisplay();
  }

  // Handle Mode Buttons (Pomodoro, Short Break, Long Break)
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Set new duration
      const minutes = parseInt(btn.getAttribute('data-minutes'), 10);
      currentModeTime = minutes * 60;
      resetTimer();
    });
  });

  // Attach button events
  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  // Initial display setup
  updateDisplay();
}
