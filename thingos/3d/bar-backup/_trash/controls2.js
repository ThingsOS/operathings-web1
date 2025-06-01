import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/PointerLockControls';

function setupAvatarControls(gltf) {

	const avatarModel = gltf.scene;

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.title = 'Character';
	SELECTED_VISOR.visorRenderer.addVisorCamera(camera);

	const controls = new PointerLockControls(camera, document.body);
	scene.add(controls.getObject());

	// Variables para el movimiento
	const movement = {
		forward: false,
		backward: false,
		left: false,
		right: false
	};

	// Evento para capturar el clic del mouse y activar los controles de puntero
	document.addEventListener('click', () => {
		controls.lock();
	});

	// Capturar eventos de teclado
	document.addEventListener('keydown', (event) => {
		handleKeyDown(event.keyCode);
	});

	document.addEventListener('keyup', (event) => {
		handleKeyUp(event.keyCode);
	});

	// Rotación de la cámara con el mouse
	const mouseMoveListener = function (event) {
		const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		const rotationSpeed = 0.002;

		const avatar = avatarModel;
		const camera = controls.getObject();

		avatar.rotation.y -= movementX * rotationSpeed;
		camera.rotation.y -= movementX * rotationSpeed;
	};

	document.addEventListener('mousemove', mouseMoveListener);

	function handleKeyDown(keyCode) {
		switch (keyCode) {
			case 87: // Tecla W
				movement.forward = true;
				break;
			case 83: // Tecla S
				movement.backward = true;
				break;
			case 65: // Tecla A
				movement.left = true;
				break;
			case 68: // Tecla D
				movement.right = true;
				break;
		}
	}

	function handleKeyUp(keyCode) {
		switch (keyCode) {
			case 87: // Tecla W
				movement.forward = false;
				break;
			case 83: // Tecla S
				movement.backward = false;
				break;
			case 65: // Tecla A
				movement.left = false;
				break;
			case 68: // Tecla D
				movement.right = false;
				break;
		}
	}

	function animate() {
		//requestAnimationFrame(animate);

		// Movimiento del avatar
		const moveSpeed = 0.1;
		const avatar = avatarModel;
		const camera = controls.getObject();

		const direction = new THREE.Vector3();
		camera.getWorldDirection(direction);

		 direction.y = 0; // Bloquear el movimiento en el eje Y

		if (movement.forward) {
			avatar.position.add(direction.multiplyScalar(-moveSpeed));
		}
		if (movement.backward) {
			avatar.position.add(direction.multiplyScalar(moveSpeed));
		}
		if (movement.left) {
			avatar.translateX(-moveSpeed);
		}
		if (movement.right) {
			avatar.translateX(moveSpeed);
		}

	}

	//animate();

}

export {
	setupAvatarControls
}
