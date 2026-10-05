export function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  let toastTimer;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}