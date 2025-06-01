import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/PointerLockControls';

class AvatarControl {

	constructor(avatar) {

		this.objects = [];

		this.setAvatar(avatar);

		this.mForward = false;
		this.mBackward = false;
		this.mLeft = false;
		this.mRigth = false;
		this.canJump = false;

		this.prevTime = performance.now();
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();

		this.camera = null;
		this.controls = null;
		this.raycaster = null;

		this.init();
		this.animate();

	}

	setAvatar(avatar) {
		this.avatar = avatar;
	}

	init() {
		this.camera = new THREE.PerspectiveCamera(
			75, window.innerWidth / window.innerHeight, 1, 1000
		);
		this.camera.position.y = 10;

		const helper = new THREE.CameraHelper(this.camera);
		scene.add(helper);

		this.controls = new PointerLockControls(this.camera, document.body);

		document.body.addEventListener('click', function () { this.controls.lock() }.bind(this));

		this.controls.addEventListener("lock", function () {
			// Al quedar bloqueado
		});

		this.controls.addEventListener("unlock", function () {
			// Al desbloquear
		});

		scene.add(this.controls.getObject());

		this.raycaster = new THREE.Raycaster(
			new THREE.Vector3(),
			new THREE.Vector3(0, -1, 0),
			0,
			10
		);


	}

	// Animaciones
	startForward() { this.mForward = true; }
	startLeft() { this.mLeft = true }
	startBackward() { this.mBackward = true }
	startRigth() { this.mRigth = true }

	stopForward() { this.mForward = false; }
	stopLeft() { this.mLeft = false }
	stopBackward() { this.mBackward = false }
	stopRigth() { this.mRigth = false }

	jump() {
		if (this.canJump === true) this.velocity.y += 350;
		this.canJump = false;
	}

	animate() {
		setTimeout(() => {
			requestAnimationFrame(() => this.animate());
		}, 10);

		const time = performance.now();

		if (this.controls.isLocked === true) {

			this.raycaster.ray.origin.copy(this.controls.getObject().position);
			this.raycaster.ray.origin.y -= 10;

			const intersections = this.raycaster.intersectObjects(
				this.objects,
				false
			);

			const onObject = intersections.length > 0;

			const delta = (time - this.prevTime) / 1000;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

			this.velocity.y -= 9.8 * 100.0 * delta;

			this.direction.z = Number(this.mForward) - Number(this.mBackward);
			this.direction.x = Number(this.mRigth) - Number(this.mLeft);
			this.direction.normalize();

			if (this.mForward || this.mBackward)
				this.velocity.z -= this.direction.z * 400.0 * delta;
			if (this.mLeft || this.mRigth)
				this.velocity.x -= this.direction.x * 400.0 * delta;

			if (onObject === true) {
				this.velocity.y = Math.max(0, this.velocity.y);
				this.canJump = true;
			}

			this.controls.moveRight(-this.velocity.x * delta);
			this.controls.moveForward(-this.velocity.z * delta);

			// Sincronizar con avatar
			let avatar = this.avatar;
			let cobj = this.controls.getObject();
			avatar.position.x = cobj.position.x;
			avatar.position.z = cobj.position.z;
			avatar.position.y = cobj.position.y - 10;

			this.camera.getWorldDirection(this.direction);

			const angle = Math.atan2(this.direction.x, this.direction.z);
			avatar.rotation.y = angle;

			this.controls.getObject().position.y += this.velocity.y * delta;

			if (this.controls.getObject().position.y < 10) {
				this.velocity.y = 0;
				this.controls.getObject().position.y = 10;
				this.canJump = true;
			}
		}

		this.prevTime = time;
	}
}

export { AvatarControl }
