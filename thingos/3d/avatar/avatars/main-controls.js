import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/PointerLockControls';

function setupAvatarControls(gtlf) {

	const objects = [];

	let moveForward = false;
	let moveBackward = false;
	let moveLeft = false;
	let moveRight = false;
	let canJump = false;

	let prevTime = performance.now();
	const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	const vertex = new THREE.Vector3();
	const color = new THREE.Color();

	init();
	animate();

	var camera, controls, raycaster;
	function init() {

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 10;

		const helper = new THREE.CameraHelper(camera);
		scene.add(helper);

		controls = new PointerLockControls(camera, document.body);

		document.body.addEventListener('click', function () {
			controls.lock();
		});

		controls.addEventListener('lock', function () {
			// Al quedar bloqueado
		});

		controls.addEventListener('unlock', function () {
			// Al desbloquear
		});

		scene.add(controls.getObject());

		const onKeyDown = function (event) {

			switch (event.code) {

				case 'ArrowUp':
				case 'KeyW':
					moveForward = true;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = true;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = true;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = true;
					break;

				case 'Space':
					if (canJump === true) velocity.y += 350;
					canJump = false;
					break;

			}

		};

		const onKeyUp = function (event) {

			switch (event.code) {

				case 'ArrowUp':
				case 'KeyW':
					moveForward = false;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = false;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = false;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = false;
					break;

			}

		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);

		raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

		//renderer.setPixelRatio(window.devicePixelRatio);
		//renderer.setSize(window.innerWidth, window.innerHeight);
		//renderer.useLegacyLights = false;
		//document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize);

		SELECTED_VISOR.visorRenderer.addVisorCamera(camera);

	}

	function onWindowResize() {

		//camera.aspect = window.innerWidth / window.innerHeight;
		//camera.updateProjectionMatrix();

		//renderer.setSize(window.innerWidth, window.innerHeight);

	}

	function animate() {

		setTimeout(function(){
			requestAnimationFrame(animate);
		}, 10)


		const time = performance.now();

		if (controls.isLocked === true) {

			raycaster.ray.origin.copy(controls.getObject().position);
			raycaster.ray.origin.y -= 10;

			const intersections = raycaster.intersectObjects(objects, false);

			const onObject = intersections.length > 0;

			const delta = (time - prevTime) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			direction.z = Number(moveForward) - Number(moveBackward);
			direction.x = Number(moveRight) - Number(moveLeft);
			direction.normalize(); // this ensures consistent movements in all directions

			if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
			if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

			if (onObject === true) {

				velocity.y = Math.max(0, velocity.y);
				canJump = true;

			}

			controls.moveRight(-velocity.x * delta);
			controls.moveForward(-velocity.z * delta);

			// Sincronizamos posición con el personaje
			let avatar = gtlf.scene;
			let cobj = controls.getObject();
			avatar.position.x = cobj.position.x;
			avatar.position.z = cobj.position.z;
			avatar.position.y = cobj.position.y - 10;

			// Sincronizamos rotación

			// ESTE ESTA MUY BUENO! PERO ROTA TODO EL PERSONAJE
			camera.getWorldDirection(direction);
			//avatar.lookAt(avatar.position.clone().add(direction));

			 // Calcula el ángulo de rotación alrededor del eje Y
			const angle = Math.atan2(direction.x, direction.z);

			// Establece el giro del personaje solo en el eje Y
			avatar.rotation.y = angle;

			controls.getObject().position.y += (velocity.y * delta); // new behavior

			if (controls.getObject().position.y < 10) {

				velocity.y = 0;
				controls.getObject().position.y = 10;

				canJump = true;

			}

		}

		prevTime = time;

	}
}

export { setupAvatarControls }
