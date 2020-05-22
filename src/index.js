import * as THREE from 'three';
import CameraController from "./CameraController";
import Universe from "./Universe";

let renderer = initializeRenderer();
let clock = new THREE.Clock();

CameraController.setRenderer(renderer);

let universe = new Universe();
CameraController.setCamera(universe.camera);

animate();

function animate() {
    update();
    renderer.render(universe, universe.camera);
    requestAnimationFrame(animate);
}

function update() {
    let delta = clock.getDelta(); // seconds.
    universe.update(delta);
    CameraController.update(delta);
}

function initializeRenderer() {
    let renderer = new THREE.WebGLRenderer();
    renderer.logarithmicDepthBuffer = true;
    renderer.setClearColor(0x000619, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        universe.camera.aspect = window.innerWidth / window.innerHeight;
        universe.camera.updateProjectionMatrix();
    });
    document.body.appendChild(renderer.domElement);
    return renderer;
}


