import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

// Obtener acceso a la captura de pantalla
const stream = await navigator.mediaDevices.getDisplayMedia({
	video: true
});

// Crear un elemento de video y asignarle el stream de captura
const videoElement = document.createElement('video');
videoElement.srcObject = stream;
videoElement.autoplay = true;
videoElement.style.display = 'none';

// Esperar a que el video comience a reproducirse para obtener sus dimensiones
await new Promise((resolve) => videoElement.onloadedmetadata = resolve);

// Calcular la relación de aspecto del video
const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;

// Ajustar las dimensiones del plano según la relación de aspecto del video
const planeWidth = 10; // Ancho del plano (puedes ajustarlo según tus necesidades)
const planeHeight = planeWidth / aspectRatio;

// Crear el plano
const planeGeometry = new THREE.PlaneGeometry(planeWidth*10, planeHeight*10); // Tamaño del plano
const videoTexture = new THREE.VideoTexture(videoElement); // Crear una textura a partir del video
const planeMaterial = new THREE.MeshBasicMaterial({
	map: videoTexture,
	side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.x = 70;
plane.position.y = (planeHeight*10)/2;

// Rotar el plano para que sea perpendicular al suelo (eje Y)
plane.rotateX(Math.PI);
plane.rotateZ(Math.PI);

scene.add(plane);
