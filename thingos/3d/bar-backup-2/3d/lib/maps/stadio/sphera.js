import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { implementInteraction } from '../../../interfaces/interactive/index.js';

// Paso 1: Crear la geometría de la esfera
const radio = 5; // Radio de la esfera
const segmentos = 32; // Cuántos segmentos horizontales y verticales tendrá la esfera
const anillos = 32; // Cuántos anillos verticales tendrá la esfera
const geometriaEsfera = new THREE.SphereGeometry(radio, segmentos, anillos);

// Paso 2: Crear un material para la esfera
const materialEsfera = new THREE.MeshBasicMaterial({
	color: 0x00ff00
}); // Puedes cambiar el color según tus preferencias

// Paso 3: Crear un objeto Mesh que combine la geometría y el material
const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
implementInteraction(esfera, {
	focusCallback: async function () {
		console.log('Estas enfocando la bola');
	},
	blurCallback: async function () {
		console.log('Se desenfocó la bola')
	},
	startInteraction: async function () {
		console.log('Hiciste click en la bola');
		esfera.material.color.set(getRandomColor());
		setTimeout(function () {
			esfera.interactiveOptions.stopInteraction();
		}, 4000);
	},
	stopInteraction: async function () {
		console.log('Termino la interacción con la bola');
	},
	instructions: 'Colorear'
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

// Paso 4: Agregar el objeto Mesh a la escena
scene.add(esfera);
