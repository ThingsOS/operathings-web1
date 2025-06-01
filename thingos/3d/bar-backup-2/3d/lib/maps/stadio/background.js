import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

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
