import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { loadMap } from './map/draw.js';
import { createVisor } from './visor/visor.js';
import { loadMainAvatar } from './avatars/main.js';
import { loadBotAvatar } from './avatars/bot.js';
import { setupMainMode } from './modes/main-mode/start.js';
import { startConnection } from './live/ws.js';

// Creación de escena
var scene = new THREE.Scene();
window.scene = scene;
window.addToScene = async function (model) {
	let r = await scene.add(model);
	return r;
}

// Cargar Mapa
loadMap();

// Cargar personaje principal
await loadMainAvatar('6185a4acfb622cf1cdc49348');
//loadBotAvatar('6185a4acfb622cf1cdc49348');

// Crear visor
createVisor();

// Setup Main Mode
await setupMainMode();
