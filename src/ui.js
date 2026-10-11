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


// ★ 新增：載入進度條
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');
const loadingBar = document.getElementById('loading-bar');

export function updateLoading(event) {
  if (event.lengthComputable) {
    // 算得出總大小：顯示百分比
    const percent = Math.min(100, Math.floor((event.loaded / event.total) * 100));
    loadingBar.classList.remove('indeterminate');
    loadingBar.style.width = `${percent}%`;
    loadingText.textContent = percent < 100 ? `載入中… ${percent}%` : '檔案載入完成，處理模型中…';
  } else {
    // 算不出總大小：只能顯示已載入多少 MB，長條改成來回滑動
    const mb = (event.loaded / (1024 * 1024)).toFixed(1);
    loadingBar.classList.add('indeterminate');
    loadingBar.style.width = '';
    loadingText.textContent = `載入中… 已載入 ${mb} MB`;
  }
}

export function hideLoading() {
  loading.classList.add('hidden');
}

export function showLoadError() {
  loadingBar.classList.remove('indeterminate');
  loadingBar.style.width = '0%';
  loadingText.textContent = '載入失敗，請重新整理，\n或查看 Console 的錯誤訊息';
}