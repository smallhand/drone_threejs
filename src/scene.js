import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';


const sun = new THREE.DirectionalLight(0xffffff, 1);

export function createScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.set(0, 5, 10);

    const controls = new TrackballControls(camera, renderer.domElement);
    //const controls = new OrbitControls(camera, renderer.domElement);

    // 燈光：模型材質多半需要光源才看得到，先加上
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    sun.position.set(5, 10, 5);
    scene.add(sun);

    camera.position.set(0, 5, 10);

    controls.rotateSpeed = 3.0;     // 預設 1.0，從 3 到 5 試起
    controls.zoomSpeed = 2.5;       // 預設 1.2
    controls.panSpeed = 1.0;        // 預設 0.3
    controls.staticMoving = true;   // 關掉慣性，放開滑鼠就停

    return { scene, camera, renderer, controls };
}

export function frameObject(gltfObject, camera, controls) {
    // 印出模型的大小與中心，判斷位置或比例有沒有問題
    const box = new THREE.Box3().setFromObject(gltfObject.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    camera.position.set(center.x, center.y + maxDim, center.z + maxDim);
    camera.lookAt(center);
    camera.far = maxDim * 10;      // 模型很大時，避免遠處被裁掉
    camera.updateProjectionMatrix();

    controls.target.copy(center);

}

export function enableResize(camera, renderer, controls) {
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    });
}


export function startRenderLoop(scene, camera, renderer, controls) {
    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}