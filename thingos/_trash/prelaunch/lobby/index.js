import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

window.addEventListener('load', function(){

	// Creamos la escena
	const scene = new THREE.Scene();

	// Creamos la cámara
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// Creamos el renderizador
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Creamos un plano para colocar el texto
	const planeGeometry = new THREE.PlaneGeometry( 5, 2 );
	const planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
	scene.add( plane );

	// Creamos el texto
	const textGeometry = new THREE.TextGeometry( "WorkOS Cloud", {
		font: new THREE.FontLoader().load('fonts/helvetiker_bold.typeface.json'),
		size: 1,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5
	} );
	const textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
	const textMesh = new THREE.Mesh( textGeometry, textMaterial );
	textMesh.position.set( -2.5, 0.5, 0 );
	plane.add( textMesh );

	// Animamos el texto
	function animate() {
		requestAnimationFrame( animate );
		textMesh.rotation.y += 0.01;
		renderer.render( scene, camera );
	}
	animate();

})
