const hud = document.getElementById('hud');

let totalEggs = 0;
let foundEggs = 0;
let startTime = null;
let endTime = null;
let timerId = null;
let finished = false;   // ★ 是否已經全部找完

function elapsedMs() {
  if (startTime === null) return 0;
  return (endTime ?? Date.now()) - startTime;
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateHud() {
  hud.textContent = `⏱ ${formatTime(elapsedMs())}　🥚 ${foundEggs} / ${totalEggs}`;
}

function stopTimer() {
  endTime = Date.now();
  clearInterval(timerId);
}

export function isFinished() {                 // ★ 讓主程式問「結束了嗎」
  return finished;
}

export function startTimer() {
  if (finished || startTime !== null) return;  // ★ 已結束也不再開始
  startTime = Date.now();
  timerId = setInterval(updateHud, 250);
}

export function updateEgg() {
  totalEggs += 1;
  updateHud();
}

export function markEggFound() {
  if (finished || foundEggs >= totalEggs) return null;   // ★ 已結束或已達總數：什麼都不做
  foundEggs += 1;
  const allFound = foundEggs === totalEggs;
  if (allFound) {
    stopTimer();
    finished = true;                                     // ★ 全部找完，鎖住狀態
  }
  updateHud();
  return {
    foundEggs,
    totalEggs,
    allFound,
    seconds: (elapsedMs() / 1000).toFixed(1),
  };
}

export function resetTimer() {
  clearInterval(timerId);
  foundEggs = 0;
  startTime = null;
  endTime = null;
  timerId = null;
  finished = false;                                      // ★ 重新開始，解除鎖定
  updateHud();
}