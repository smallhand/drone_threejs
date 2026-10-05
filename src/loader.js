import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel() {
    const loader = new GLTFLoader();
    return loader;
}