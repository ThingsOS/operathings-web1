import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	implementMirror
} from '../../../interfaces/mirror/index.js';

// Crear la geometría del cubo
let heigth = 50;
const cubeGeometry = new THREE.BoxGeometry(50, heigth, 50); // Ancho, altura, profundidad

// Crear una textura de ruido
function createNoiseTexture(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = Math.random() * 255; // Generar valor aleatorio entre 0 y 255
      context.fillStyle = `rgb(${value}, ${value}, ${value})`;
      context.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// En tu código Three.js, donde creas el objeto que quieres texturar:

// Crear un material blanco con textura de ruido
const material = new THREE.MeshBasicMaterial({
  map: createNoiseTexture(512), // Tamaño de la textura de ruido (ajústalo según tus necesidades)
  color: 0xffffff, // Color blanco
  side: THREE.DoubleSide // Renderizar ambos lados del objeto
});


// Crear una malla (mesh) combinando la geometría y el material
const cube = new THREE.Mesh(cubeGeometry, material);

// Agregar la malla a la escena
scene.add(cube);

cube.position.x = -70;
cube.position.y = heigth/2;

implementMirror(cube);
