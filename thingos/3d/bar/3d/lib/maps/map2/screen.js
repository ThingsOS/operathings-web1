import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	implementMirror
} from '../../../interfaces/mirror/index.js';



// Crear la geometría del cubo
let heigth = 50;
const cubeGeometry = new THREE.BoxGeometry(50, heigth, 10); // Ancho, altura, profundidad

// Crear el material para el cubo
const cubeMaterial = new THREE.MeshBasicMaterial({
	color: 0x00ff00
}); // Verde

// Crear una malla (mesh) combinando la geometría y el material
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Agregar la malla a la escena
scene.add(cube);

cube.position.x = -70;
cube.position.y = heigth/2;

implementMirror(cube);
