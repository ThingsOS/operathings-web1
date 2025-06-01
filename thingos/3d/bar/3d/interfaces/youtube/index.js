import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	implementInteraction
} from '../interactive/index.js';
import { startVideo } from '../video/index.js';

async function implementYoutube(obj, config) {

	implementInteraction(obj, [{
		actionName: 'YOUTUBE-PLAY',
		toState: 'PLAY',
		forStates: ['STOP'],
		startInteraction: async function () {

			try { startYoutube(obj, '/3d/bar/3d/lib/videos/rabbit.mp4') }
			catch (e) { stopYoutube(obj) }

			skipInteraction();

		},
		icon: 'airplay',
		instructions: 'Agregar video',
		focusDistance: 150
	}, {
		actionName: 'YOTUBE-STOP',
		toState: 'STOP',
		forStates: ['PLAY'],
		startInteraction: async function () {
			stopYoutube(obj);
			skipInteraction();
		},
		icon: 'stop_circle',
		instructions: 'Cortar reproducción',
		focusDistance: 150
	}]);

	changeActionState(obj, 'STOP');

}

async function startYoutube(plane, url) {

	// Si el link no es de youtube
	if(!url.startsWith('youtu.be')) {
		startVideo(plane, url);
		return;
	}

	// Obtén el elemento DIV y el elemento de video
	const miDiv = document.createElement("div");
	const iframe = document.createElement('iframe');
	iframe.href = url;
	miDiv.appendChild(iframe);

	// Crea un canvas
	const canvas = document.createElement("canvas");
	canvas.width = miDiv.clientWidth; // Establece el ancho del canvas igual al ancho del DIV
	canvas.height = miDiv.clientHeight; // Establece el alto del canvas igual al alto del DIV
	const ctx = canvas.getContext("2d");

	// Convierte el canvas en un MediaStream
	const stream = canvas.captureStream();

	// Función para capturar el contenido visual del DIV en el canvas
	function capturarContenidoDiv() {

		// Dibuja el contenido del DIV en el canvas
		ctx.drawImage(miDiv, 0, 0, miDiv.clientWidth, miDiv.clientHeight);

		// Repite la captura y actualización del video
		requestAnimationFrame(capturarContenidoDiv);
	}

	// Inicia la captura y reproducción del contenido del DIV
	capturarContenidoDiv();

	startVideo(plane, stream);

	return stream;

}

function stopYoutube(plane) {
	stopVideo(plane);
}

export {
	implementYoutube
}
