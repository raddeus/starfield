import * as THREE from "three/src/Three";
import Starfield from "./Starfield";

export default class Universe extends THREE.Scene {

    constructor() {
        super();
        this.sections = [];
        this.currentSection = null;
        this.sectionSize = 5000000;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, this.sectionSize);
        this.loadSkyBox();
    }

    loadSkyBox() {
        const imagePrefix = "skybox/unity-2048/sky_";
        const imageSuffix = ".png";
        const directions  = ["left", "right", "up", "down", 'front', 'back'];
        const urls = directions.map(direction => imagePrefix + direction + imageSuffix);
        let cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.load(
            urls,
            texture => {
                this.background = texture;
            },
            progress => {},
            error => {},
        );
    }

    loadSection(index) {
        let sectionStart = -this.sectionSize * index;
        let boxStart = new THREE.Vector3(-this.sectionSize, -this.sectionSize, sectionStart);
        let boxEnd = new THREE.Vector3(this.sectionSize, this.sectionSize, sectionStart - this.sectionSize);
        let colors = [
            '#d8d8c3',
            '#f2a359',
            '#2B8BBC',
        ];
        let sizes = [
            10000,
            30000,
            50000,
        ];
        let starField = Starfield.create(boxStart, boxEnd, 5000, colors, sizes, 50000);
        this.sections[index] = starField;

        if (this.sections[index-2]) {
            this.remove(this.sections[index-2]);
        }
        this.add(starField);
    }

    update(delta) {
        this.camera.position.z -= 500000*delta;
        let currentSectionIndex = Math.floor(Math.abs(this.camera.position.z / this.sectionSize));
        const cameraSectionOffset = Math.abs(this.camera.position.z % this.sectionSize);
        if (cameraSectionOffset > (this.sectionSize / 10)) {
            currentSectionIndex++;
        }

        if (this.currentSectionIndex !== currentSectionIndex) {
            this.loadSection(currentSectionIndex);
            this.currentSectionIndex = currentSectionIndex;
        }

        const offsetPercent = 100 * (cameraSectionOffset / this.sectionSize);
        if (offsetPercent > 10 && offsetPercent < 90) {
            this.sections[currentSectionIndex].children.forEach(child => {
                child.material.opacity = offsetPercent / 90;
            });
        }
    }

}