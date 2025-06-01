import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import TWEEN from 'https://cdn.skypack.dev/tween@latest?dts';
import { createFreeCamera } from './camfree.js';

const VISORS = [];
window.VISORS = VISORS;

window.SELECTED_VISOR = null;
function createVisor() {

	let vw = new VisorView();
	VISORS.push(vw);

	SELECTED_VISOR = VISORS[0];

}

window.updateVisors = function() {
	for(let inx = 0; inx < VISORS.length; inx++) {
		VISORS[inx].visorRenderer.updateVisor();
	}
}

// Eventos
document.addEventListener('keyup', (event) => {
	console.log(event.keyCode);
	console.log(SELECTED_VISOR.CAMERAS);
	if (event.keyCode === 67) {
		SELECTED_VISOR.visorRenderer.nextCamera();
	}
});
window.addEventListener('resize', function () {
	updateVisors();
});

class VisorView {

	constructor() {
		let vr = new VisorRenderer();
		document.getElementById("container").appendChild(vr.renderer.domElement);
		this.visorRenderer = vr;
	}

	update() {
		this.visorRenderer.updateVisor();
	}

}

class VisorRenderer {

	constructor() {

		// Creación del renderizador
		var renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer = renderer;

		// Camaras
		this.SELECTED_CAMERA = null;
		this.CAMERAS = [];

		// Camara inicial
		let cam = createFreeCamera(renderer);
		this.addVisorCamera(cam);
		this.nextCamera();

		// Renderizar
		this.updateRender();

	}

	addVisorCamera(camera) {
		this.CAMERAS.push(camera);
	}

	nextCamera() {
		let camera = this.CAMERAS[this.CAMERAS.indexOf(this.SELECTED_CAMERA) + 1] || this.CAMERAS[0];
		this.selectCamera(camera);
	}

	selectCameraID(cameraID) {}

	selectCamera(camera) {
		console.log(`Change to camera "${camera.title}"`);
		this.SELECTED_CAMERA = camera;
		this.updateVisor();
	}

	updatePerspective() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		// Actualiza la perspectiva de la camara
		this.SELECTED_CAMERA.fov = 60; // Nueva apertura angular (Field of View)
		this.SELECTED_CAMERA.aspect = window.innerWidth / window.innerHeight; // Nueva relación de aspecto
		this.SELECTED_CAMERA.updateProjectionMatrix(); // Actualización de la matriz de proyección
	}

	updateVisor() {
		this.updatePerspective();
	}

	async updateRender() {

		// Si la cámara tiene un callback de actualización, ejecuta
		if(this.SELECTED_CAMERA && this.SELECTED_CAMERA.updateCallback) {
			this.SELECTED_CAMERA.updateCallback()
		}
		this.renderer.render(scene, this.SELECTED_CAMERA);
		let f = this.updateRender.bind(this);
		setTimeout(async function(){
			await requestAnimationFrame(f);
			f = null;
		}, 10)

		//TWEEN.update(); // Actualizar la librería TWEEN en cada frame
	}

}

export { createVisor }
