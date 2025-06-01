import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.154.0/three.module.min.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls';
import TWEEN from 'https://cdn.skypack.dev/tween@latest?dts';

// Configuración inicial
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 400);
document.getElementById("container").appendChild(renderer.domElement);

// Crear el cubo
var cubeGeometry = new THREE.BoxGeometry(1, 0.5, 1);
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
var cubeMaterial = new THREE.MeshLambertMaterial({ map: texture });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;
scene.add(cube);

// Crear el suelo
var groundGeometry = new THREE.PlaneGeometry(10, 10); // Ancho y largo del suelo
var gTextureLoader = new THREE.TextureLoader();
var gTexture = textureLoader.load('https://st2.depositphotos.com/1105977/8418/i/450/depositphotos_84188754-stock-photo-green-grass-texture.jpg');
var groundMaterial = new THREE.MeshBasicMaterial({ map: gTexture });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotar el suelo para que esté horizontal
scene.add(ground);

// Configuración de los controles OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

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

// Actualizar el ancho del cubo de forma animada
document.getElementById("widthInput").addEventListener("input", function (event) {
  var width = parseFloat(event.target.value);
  animateCubeWidth(cube, width);
});

document.getElementById("yInput").addEventListener("input", function (event) {
  var width = parseFloat(event.target.value);
  animateCubeHeight(cube, width);
});

// Configuración de la cámara y renderizado
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update(); // Actualizar la librería TWEEN en cada frame
}
animate();

// Función para animar el cambio de anchura del cubo
function animateCubeWidth(cube, newWidth) {
	if(!newWidth) { return };
  var currentWidth = cube.scale.x;

  // Utilizar TWEEN.js para la interpolación
  new TWEEN.Tween({ width: currentWidth })
    .to({ width: newWidth }, 500) // Duración de la animación en milisegundos
    .easing(TWEEN.Easing.Quadratic.Out) // Efecto de aceleración de salida
    .onUpdate(function () {
      cube.scale.x = this.width;
    })
    .start();

	document.getElementById('priceInput').value = newWidth * 2;

}
