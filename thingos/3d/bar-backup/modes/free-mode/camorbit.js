import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls';
import TWEEN from 'https://cdn.skypack.dev/tween@latest?dts';

function createFreeCamera(renderer) {

	// Creación de cámara global
	var globalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	globalCamera.title = 'Free';
	// Configuración de la cámara y renderizado
	globalCamera.position.z = 5;

	// Configuración de los controles OrbitControls
	var controls = new OrbitControls(globalCamera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// Función que se ejecuta al actualizar el frame
	globalCamera.updateCallback = function() {
		controls.update();
	}

	return globalCamera;

}

export { createFreeCamera }
