import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { implementInteraction } from '../interactive/index.js';

async function implementMirror(obj, config) {

	implementInteraction(obj, {
		focusCallback: async function () {
			console.log('Estas enfocando la pantalla');
		},
		blurCallback: async function () {
			console.log('Se desenfocó la pantalla')
		},
		startInteraction: async function () {
			console.log('Hiciste click en la pantalla');
			startMirrior(obj);
		},
		stopInteraction: async function () {
			console.log('Termino la interacción con la pantalla');
		},
		icon: 'cast',
		instructions: 'Transmitir pantalla',
		focusDistance: 150
	});

}

async function startMirrior(plane) {

	// Obtener acceso a la captura de pantalla
	const stream = await navigator.mediaDevices.getDisplayMedia({
		video: true
	});
	window.lockControls();

	// Crear un elemento de video y asignarle el stream de captura
	const videoElement = document.createElement('video');
	videoElement.srcObject = stream;
	videoElement.autoplay = true;
	videoElement.style.display = 'none';

	// Esperar a que el video comience a reproducirse para obtener sus dimensiones
	await new Promise((resolve) => videoElement.onloadedmetadata = resolve);

	// Crear el plano
	const videoTexture = new THREE.VideoTexture(videoElement); // Crear una textura a partir del video
	const planeMaterial = new THREE.MeshBasicMaterial({
		map: videoTexture,
		side: THREE.DoubleSide
	});
	plane.material = planeMaterial;

}

export { implementMirror }
