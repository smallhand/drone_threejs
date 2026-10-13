const TAP_MAX_MOVE = 10;   // ★ 移動超過 10 像素就當成拖曳
 
export function onTap(element, callback) {                       // ★
  let tapStart = null;     // ★ 按下的位置與指標編號；null 代表這次不算輕點
  let activePointers = 0;  // ★ 目前有幾根手指（或滑鼠）按在 element 上
 
  element.addEventListener('pointerdown', (event) => {
    activePointers++;
    if (activePointers === 1 && event.button === 0) {
      tapStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    } else {
      tapStart = null;     // 第二根手指放上來（雙指操作）或不是左鍵，不算輕點
    }
  });
 
  element.addEventListener('pointerup', (event) => {
    activePointers = Math.max(0, activePointers - 1);
    if (!tapStart || event.pointerId !== tapStart.id) return;
 
    const dx = event.clientX - tapStart.x;
    const dy = event.clientY - tapStart.y;
    tapStart = null;
 
    if (Math.hypot(dx, dy) > TAP_MAX_MOVE) return;   // 移動太多，是拖曳
    callback(event);
  });
 
  element.addEventListener('pointercancel', () => {
    activePointers = Math.max(0, activePointers - 1);
    tapStart = null;       // 瀏覽器中斷了這次觸控，不算輕點
  });
}
 