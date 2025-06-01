import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	implementInteraction
} from '../interactive/index.js';

async function implementMirror(obj, config) {

	implementInteraction(obj, {
		actionName: 'SHARE-SCREEN',
		startInteraction: async function () {
			console.log('Hiciste click en la pantalla');

			if(obj.streamActive) {
				closeMirrior(obj);
				return;
			}

			try { startMirrior(obj) }
			catch(e) { closeMirrior(obj) }

		},
		icon: 'cast',
		instructions: 'Transmitir pantalla',
		focusDistance: 150
	}, {
		actionName: 'SHARE-SCREEN-NONE',
		contexts: ['SHARE-SCREEN'],
		excludeGlobalContext: true,
		startInteraction: async function() {

		}
	});

}

async function startMirrior(plane) {

	if(plane.streamActive) {
		closeMirrior(plane);
	}

	// Guardamor el material original
	plane.originMaterial = plane.material;

	// Obtener acceso a la captura de pantalla
	const stream = await navigator.mediaDevices.getDisplayMedia({
		video: true
	});
	window.lockControls();
	plane.stream = stream;

	// Suponiendo que ya tienes el stream almacenado en la variable "stream"
	stream.addEventListener('error', (event) => {
		console.log('El stream ha llegado al final.');
		closeMirrior(plane);
	});

	stream.getTracks().forEach(track => {
		track.addEventListener('error', (event) => {
			console.log('El stream ha llegado al final.');
			closeMirrior(plane);
		});
		track.addEventListener('ended', (event) => {
			console.log('El stream ha llegado al final.');
			closeMirrior(plane);
		});
	});

	stream.addEventListener('ended', () => {
		console.log('El stream ha llegado al final.');
		closeMirrior(plane);
	});

	// Setemoas el plano con un stream activo
	plane.streamActive = true;

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

function closeMirrior(plane) {
	plane.material = plane.originMaterial;
	plane.streamActive = false;
	if(plane.stream.active) {
		stopMediaStream(plane.stream);
	}
}

function stopMediaStream(stream) {
  if (stream && stream instanceof MediaStream) {
    stream.getTracks().forEach(track => track.stop());
    //console.log('MediaStream detenido con éxito.');
  } else {
    //console.warn('El objeto proporcionado no es un MediaStream válido.');
  }
}

export { implementMirror }
