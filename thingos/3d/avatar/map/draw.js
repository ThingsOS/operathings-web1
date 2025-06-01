import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

async function loadMap() {

	// Crear el suelo
	var groundGeometry = new THREE.PlaneGeometry(1000, 1000); // Ancho y largo del suelo
	var gTextureLoader = new THREE.TextureLoader();
	var gTexture = gTextureLoader.load('https://st2.depositphotos.com/1105977/8418/i/450/depositphotos_84188754-stock-photo-green-grass-texture.jpg');
	// Configurar la propiedad wrapS y wrapT de la textura
	gTexture.wrapS = THREE.RepeatWrapping;
	gTexture.wrapT = THREE.RepeatWrapping;

	// Definir el número de repeticiones en cada dirección
	const repeatX = 10; // Repetir 4 veces horizontalmente
	const repeatY = 10; // Repetir 2 veces verticalmente

	// Calcular automáticamente el número de repeticiones necesarias
	gTexture.repeat.set(repeatX, repeatY);

	var groundMaterial = new THREE.MeshBasicMaterial({
		map: gTexture
	});
	var ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2; // Rotar el suelo para que esté horizontal
	scene.add(ground);

	// Agregar luz ambiente
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	// Agregar luz direccional
	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

	// Agregar textura de fondo (cubemap)
	var cubeMapUrls = [
	  'URL_IZQUIERDA',
	  'URL_DERECHA',
	  'URL_ARRIBA',
	  'URL_ABAJO',
	  'URL_ADELANTE',
	  'URL_ATRAS'
	];
	var cubeMapLoader = new THREE.CubeTextureLoader();
	var cubeMapTexture = cubeMapLoader.load(cubeMapUrls);
	scene.background = cubeMapTexture;

}

export {
	loadMap
}
