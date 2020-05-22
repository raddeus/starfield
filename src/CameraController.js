import * as THREE from 'three';

class CameraController {

    constructor() {
        this.rotationSpeed = THREE.Math.degToRad(180); // degrees/sec

    }

    setRenderer(renderer) {
        this.renderer = renderer;
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    }

    setCamera(camera) {
        this.camera = camera;
        this.camera.rotation.order = 'YZX';

        // vertical rotation around X-axis (y-up)
        this.defaultRotationX = this.camera.rotation.x;
        this.targetRotateX = this.defaultRotationX;

        // horizontal rotation around Y-axis (y-up)
        this.defaultRotationY = this.camera.rotation.y;
        this.targetRotateY = this.defaultRotationY;
    }

    update(delta) {
        if (!this.camera) return;

        if (this.camera.rotation.x < this.targetRotateX) {
            this.camera.rotation.x = Math.min(
                this.camera.rotation.x + this.rotationSpeed * delta,
                this.targetRotateX
            );
        } else if (this.camera.rotation.x > this.targetRotateX) {
            this.camera.rotation.x = Math.max(
                this.camera.rotation.x - this.rotationSpeed * delta,
                this.targetRotateX
            );
        }
        if (this.camera.rotation.y < this.targetRotateY) {
            this.camera.rotation.y = Math.min(
                this.camera.rotation.y + this.rotationSpeed * delta,
                this.targetRotateY
            );
        } else if (this.camera.rotation.y > this.targetRotateY) {
            this.camera.rotation.y = Math.max(
                this.camera.rotation.y - this.rotationSpeed * delta,
                this.targetRotateY
            );
        }
    }

    onTouchEnd(event) {
        if (this.touchMoved) {
            event.preventDefault();
        }
    }

    onTouchStart(event) {
        this.touching = true;
        this.touchMoved = false;
    }

    onTouchMove(event) {
        this.touchMoved = true;
        const clientX = event.touches[0].clientX;
        const clientY = event.touches[0].clientY;
        this.updateTargetRotation(clientX, clientY);
        event.preventDefault();
    }

    onMouseMove(event) {
        if (this.touching) {
            this.touching = false;
            return;
        }
        this.updateTargetRotation(event.clientX, event.clientY);
    }

    updateTargetRotation(clientX, clientY) {
        const halvedClientWidth = this.renderer.domElement.clientWidth / 2;
        const halvedClientHeight = this.renderer.domElement.clientHeight / 2;
        const centerDiffX = halvedClientWidth - clientX;
        const centerDiffY = halvedClientHeight - clientY;
        const centerDiffPercentX = centerDiffX / halvedClientWidth;
        const centerDiffPercentY = centerDiffY / halvedClientHeight;

        this.targetRotateY = this.defaultRotationY + centerDiffPercentX * 0.4;
        this.targetRotateX = this.defaultRotationX + centerDiffPercentY * 0.4;
    }

    onMouseLeave(event) {
        this.targetRotateX = this.defaultRotationX;
        this.targetRotateY = this.defaultRotationY;
    }

}

let cameraController = new CameraController();
export default cameraController;