import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

// Agregar luz ambiente
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Agregar luz direccional
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
