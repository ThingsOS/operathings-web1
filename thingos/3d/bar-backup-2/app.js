import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { loadMap } from './3d/map/draw.js';
import { createVisor } from './3d/visor/visor.js';
import { loadMainAvatar } from './3d/avatars/main.js';
import { loadBotAvatar } from './3d/avatars/bot.js';
import { setupMainMode } from './3d/modes/main-mode/start.js';
import { startConnection } from './live/ws.js';
import { createFreeCamera } from './3d/modes/free-mode/camfree.js';

// Creación de escena
window.OBJS = {};
var scene = new THREE.Scene();
window.scene = scene;
window.addToScene = async function (model, id) {
	let r = await scene.add(model);
	if(id) { OBJS[id] = model }
	return r;
}

// Cargar Mapa
await loadMap('stadio');

// Inicia la conexión
await startConnection();

// Cargar personaje principal
await loadMainAvatar();

// Crear visor
let vw = await createVisor();
window.SELECTED_VISOR = vw;

/** ESTA SECCIÓN DEBERÍA ESTABLECER EL MODO NADA MÁS **/

// Establecemos el modo free
let cam = createFreeCamera(vw.visorRenderer.renderer);
vw.visorRenderer.addVisorCamera(cam);
vw.visorRenderer.nextCamera();

/****/

// Setup Main Mode
await setupMainMode();


