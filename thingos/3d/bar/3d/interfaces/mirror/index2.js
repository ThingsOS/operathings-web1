import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	implementInteraction
} from '../interactive/index.js';

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
			stopInteracion();
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

	if (plane.streamActive) {
		closeMirrior(plane);
	}

	// Guardamor el material original
	plane.originMaterial = plane.material;

	// Obtener acceso a la captura de pantalla
	var stream
	try { stream = await navigator.mediaDevices.getDisplayMedia({ video: true }) } catch (e) { closeMirrior(plane); return; }

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
	videoElement.style.padding = '20px';
	videoElement.srcObject = stream;
	videoElement.autoplay = true;
	videoElement.style.display = 'none';
	videoElement.height = '200px';
	videoElement.width = '600px';

	// Esperar a que el video comience a reproducirse para obtener sus dimensiones
	await new Promise((resolve) => videoElement.onloadedmetadata = resolve);

	// Crear el plano

	const videoTexture = new THREE.VideoTexture(videoElement); // Crear una textura a partir del video
	const videoMaterial = new THREE.MeshBasicMaterial({
		map: videoTexture,
		side: THREE.DoubleSide
	});

	//let videoMaterial = createVideoMaterial(plane, videoElement);

	plane.material = videoMaterial;

}

function createVideoMaterial(plane, videoElement) {


	// @TODO: Esta solucion parece ir a medias pero gasta mucho para tan poca resolucion

	// Obtiene la caja delimitadora del objeto en el espacio 3D.
const boundingBox = new THREE.Box3().setFromObject(plane);

// Obtiene las dimensiones de la caja delimitadora.
const boundingBoxSize = new THREE.Vector3();
boundingBox.getSize(boundingBoxSize);

// Calcula el ancho, alto y profundidad de la caja delimitadora.
const ancho = boundingBoxSize.x;
const alto = boundingBoxSize.y;
const profundidad = boundingBoxSize.z;


	// Crea un canvas y su contexto.
	const canvas = document.createElement("canvas");
	canvas.width = ancho*100; // Ancho del canvas (ajusta según tus necesidades)
	canvas.height = alto*100; // Alto del canvas (ajusta según tus necesidades)
	const ctx = canvas.getContext("2d");

	// Crea una textura de canvas a partir del canvas.
	const canvasTexture = new THREE.CanvasTexture(canvas);

	// Crea un material a partir de la textura de canvas.
	const canvasMaterial = new THREE.MeshBasicMaterial({
		map: canvasTexture
	});

	// Función para dibujar el video en el canvas sin distorsionar el aspecto.
	function drawVideo() {

		if (videoElement.paused || videoElement.ended) {
			return;
		}

		const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
		const canvasAspectRatio = canvas.width / canvas.height;

		// Calcula las proporciones de dibujo para el canvas sin distorsionar el aspecto.
		let drawWidth = canvas.width;
		let drawHeight = canvas.height;

		if (videoAspectRatio > canvasAspectRatio) {
			drawHeight = canvas.width / videoAspectRatio;
		} else {
			drawWidth = canvas.height * videoAspectRatio;
		}

		const drawX = (canvas.width - drawWidth) / 2;
		const drawY = (canvas.height - drawHeight) / 2;

		// Dibuja el video en el canvas sin distorsionar el aspecto.
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);

		// Actualiza la textura de canvas.
		canvasTexture.needsUpdate = true;

		// Repite el dibujo para obtener una animación continua (30 fps).
		requestAnimationFrame(drawVideo);
	}

	// Inicia el dibujo del video en el canvas.
	videoElement.addEventListener("play", function () {
		drawVideo();
	});


	return canvasMaterial;

}

function closeMirrior(plane) {
	plane.material = plane.originMaterial;
	plane.streamActive = false;
	stopInteracion();
	if (plane.stream && plane.stream.active) {
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

export {
	implementMirror
}
