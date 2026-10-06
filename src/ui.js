const toast = document.getElementById('toast');
const resultPanel = document.getElementById('result');
const resultTime = document.getElementById('result-time');

let toastTimer;

export function showToast(message, duration = 2500) {

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


export function showResult(seconds) {
  resultTime.textContent = `用時 ${seconds} 秒`;
  resultPanel.classList.add('show');
}

export function hideResult() {
  resultPanel.classList.remove('show');
}