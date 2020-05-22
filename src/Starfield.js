import * as THREE from "three/src/Three";

export default class Starfield extends THREE.Object3D {

    static hexToRGB(hex, alpha = 1.0) {
        const r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }

    static create(
        boxStart = new THREE.Vector3(),
        boxEnd = new THREE.Vector3(),
        totalStars = 0,
        colors = [
            '#d8d8c3',
            '#f2a359',
            '#2B8BBC',
        ],
        sizes = [
            500,
            1000,
            2000,
            5000,
            10000,
        ],
        minZ = 0,
    ) {
        let starField = new THREE.Object3D();
        for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
            let color = colors[colorIndex];
            let starsMaterial = new THREE.PointsMaterial({
                blending: THREE.AdditiveBlending,
                map: Starfield.createStarTexture(color, 256),
                alphaTest: 0.0005,
                depthWrite: false,
                transparent: true,
            });
            for (let sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
                let size = sizes[sizeIndex];
                let starsGeometry = new THREE.Geometry();
                for (let i = 0; i < Math.min(totalStars / sizes.length / colors.length); i++) {
                    let star = new THREE.Vector3();
                    star.x = THREE.Math.randFloat(boxStart.x, boxEnd.x);
                    star.y = THREE.Math.randFloat(boxStart.y, boxEnd.y);
                    star.z = THREE.Math.randFloat(boxStart.z, boxEnd.z);
                    if (star.clone().setX(0).setY(0).distanceTo(star) < minZ) {
                        continue;
                    }
                    starsGeometry.vertices.push(star);
                }
                let sizedMaterial = starsMaterial.clone();
                sizedMaterial.size = size;
                let stars = new THREE.Points( starsGeometry, sizedMaterial );
                stars.renderOrder = 5000;
                starField.add(stars);
            }
        }
        return starField;
    }

    static createStarTexture(color, size) {
        const matCanvas = document.createElement('canvas');
        matCanvas.width = matCanvas.height = size;
        const matContext = matCanvas.getContext('2d');

        // create texture object from canvas.
        const texture = new THREE.Texture(matCanvas);
        // Draw a circle
        const center = size / 2;

        const gradient = matContext.createRadialGradient(
            center,
            center,
            0,
            center,
            center,
            size / 2
        );

        gradient.addColorStop(0, color);
        gradient.addColorStop(0.03, color);
        gradient.addColorStop(0.2, Starfield.hexToRGB(color, 0.1));
        gradient.addColorStop(1, Starfield.hexToRGB(color, 0.0));
        matContext.fillStyle = gradient;
        matContext.fillRect(0, 0, size, size);
        // need to set needsUpdate
        texture.needsUpdate = true;
        // return a texture made from the canvas
        return texture;
    }

}