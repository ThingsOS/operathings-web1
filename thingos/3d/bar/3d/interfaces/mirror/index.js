import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { implementInteraction } from '../interactive/index.js';
import { startVideo } from '../video/index.js';

async function implementMirror(obj, config) {

	implementInteraction(obj, [{
		actionName: 'SHARE-SCREEN',
		startInteraction: async function () {
			console.log('Hiciste click en la pantalla');

			if (obj.streamActive) {
				closeMirrior(obj);
				return;
			}

			try {
				startMirrior(obj)
			} catch (e) {
				closeMirrior(obj)
			}

		},
		icon: 'cast',
		instructions: 'Transmitir pantalla',
		focusDistance: 150
	}, {
		actionName: 'SHARE-SCREEN-NONE',
		contexts: ['SHARE-SCREEN'],
		excludeGlobalContext: true,
		startInteraction: async function () {
			closeMirrior(obj);
			skipInteraction();
		},
		icon: 'close',
		instructions: 'Dejar de transmitir',
		focusDistance: 150
	}]);

}

async function startMirrior(plane) {
	try {
		_startMirrior(plane)
	} catch (e) {
		console.error(e);
		closeMirrior()
	}
}
async function _startMirrior(plane) {

	// Obtener acceso a la captura de pantalla
	var stream
	try { stream = await navigator.mediaDevices.getDisplayMedia({ video: true }) } catch (e) { closeMirrior(plane); return; }

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

	startVideo(plane, stream);

}

function closeMirrior(plane) {
	stopVideo(plane);
}

export {
	implementMirror
}
