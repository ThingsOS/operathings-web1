import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls';

// MapControls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move

const MOUSE = THREE.MOUSE;
const TOUCH = THREE.TOUCH;
class MapControls extends OrbitControls {

	constructor( object, domElement ) {

		super( object, domElement );

		this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

		this.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE };

		this.touches = { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE };

	}

}

function createFreeCamera(renderer) {

	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.title = 'Free camera';
	camera.position.set( 0, 20, 100 );

	// Crear FlyControls
	const mapControls = new MapControls(camera, renderer.domElement);
	mapControls.enableDamping = true;

	// Render loop
	/*
	function animate() {
		requestAnimationFrame(animate);
		mapControls.update(1);
	}

	animate();
	*/

	return camera;
}

export { createFreeCamera }
