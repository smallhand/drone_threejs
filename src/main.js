import * as THREE from 'three';
import { loadModel } from './loader.js';
import { createScene, enableResize, frameObject, startRenderLoop } from './scene.js';
import { startTimer, updateEgg, markEggFound, resetTimer, isFinished } from './timer.js';
import { hideResult, showResult, showToast } from './ui.js';

const restartBtn = document.getElementById('restart-btn');
const loader = loadModel();
const {scene, camera, renderer, controls} = createScene();

enableResize();
startRenderLoop(scene, camera, renderer, controls)

loader.load(
  'blender_output.glb', // 放在跟 index.html 同一個資料夾
  (gltf) => {

    frameObject(gltf, camera, controls)
    scene.add(gltf.scene);

    //gltf.scene.traverse((obj) => {
    //  console.log('-'.repeat(obj.parent === gltf.scene ? 0 : 2), obj.name, `(${obj.type})`);
    //});
    //gltf.scene.traverse((obj) => console.log(obj.name, `(${obj.type})`));


    const characterArmature = gltf.scene.getObjectByName('CharacterArmature');
    if (characterArmature) {
      characterArmature.userData.isEgg = true;
      characterArmature.userData.found = false;
      updateEgg()

    } else {
      console.warn('找不到 CharacterArmature，請確認匯出的模型裡名稱是否一致');
    }
  },
  undefined,
  (error) => console.error('載入失敗', error)
);

window.addEventListener('click', (event) => {
  if (isFinished()) return;                           // ★ 取代 gameOver
  if (event.target !== renderer.domElement) return;

  startTimer();    // ★ 第一次點擊才開始計時（之後再呼叫會直接跳過）

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // 1. 把滑鼠的像素座標，換算成 NDC
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 2. 從相機、往滑鼠指的方向，射出這條線
  raycaster.setFromCamera(pointer, camera);

  // 3. 問這條線，打中了 scene 裡的哪些東西（true 代表連子物件也要檢查）
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const eggRoot = findEggRoot(hit);   // ★ 取代 isPartOfEgg(hit)，回傳彩蛋的節點或 null

    if (!eggRoot) {
      //console.log('點到公園本體：', hit.name);
      return;
    }

    if (eggRoot.userData.found) {
      console.log('這個彩蛋已經找過了');
      return
    } 

    const result = markEggFound();   // ★ 找到數 +1、更新畫面，全部找完會自動停止計時
      if (!result) return;                                // ★ 已結束或已達總數，不處理

      eggRoot.userData.found = true;                      // ★ 成功計入之後才標記


     if (result.allFound) {
      showResult(result.seconds)
    } else {
      showToast(`🥚 已找到 ${result.foundEggs} / ${result.totalEggs}`);
    }
  }
});
restartBtn.addEventListener('click', restartGame);

function findEggRoot(object) {
  if (object.userData.isEgg) return object;
  let root = null;
  object.traverseAncestors((ancestor) => {
    if (ancestor.userData.isEgg) root = ancestor;
  });
  return root;
}

function restartGame() {
  scene.traverse((obj) => {
    if (obj.userData.isEgg) obj.userData.found = false;
  });
  resetTimer();                      // 同時把 finished 改回 false
  hideResult();
  controls.enabled = true;
  //controls.reset();
  //location.reload()
}