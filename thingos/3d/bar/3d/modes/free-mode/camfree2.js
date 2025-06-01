import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/PointerLockControls';

function createFreeCamera() {

	// Variables para el movimiento
	const movement = {
		forward: false,
		backward: false,
		left: false,
		right: false
	};

	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.title = 'Free Camera';
	camera.position.z = 5;
	camera.position.x = 5;
	camera.position.y = 5;

	// Configurar controles de puntero (PointerLockControls)
	const controls = new PointerLockControls(camera, document.body);
	scene.add(controls.getObject());

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
		controls.getObject().rotation.y -= movementX * 0.002;
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
		requestAnimationFrame(animate);

	  // Movimiento de la cámara
	  const moveSpeed = 0.1;
	  const frontVector = new THREE.Vector3(0, 0, -1);
	  const sideVector = new THREE.Vector3(-1, 0, 0);

	  if (movement.forward) {
		controls.moveForward(-moveSpeed);
	  }
	  if (movement.backward) {
		controls.moveForward(moveSpeed);
	  }
	  if (movement.left) {
		controls.moveRight(-moveSpeed);
	  }
	  if (movement.right) {
		controls.moveRight(moveSpeed);
	  }

	}

	return camera;

}

export { createFreeCamera }
