import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

const NEAR_POS = 100;

// Guaramos los objetos que estan enfocados o que estan siendo controlados
window.FOCUS_OBJECT = null;
window.ACTIVE_OBJECT = null;
window.ACTIVE_ACTION = null;

const INTERACTIVE_OBJECTS = [];

// El objeto interactiveOptions puede tener:
// - focusCallback
// - blurCallback
// - startInteraction
// - stopInteraction
// - focusDistance

function implementInteraction(object, interactiveOptions) {
	INTERACTIVE_OBJECTS.push(object);
	object.interactiveOptions = interactiveOptions || {};
	object.interactiveOptions.focusDistance ??= 20;
}

function enableInteractions() {

	const objetoPosition = new THREE.Vector3();
	const camaraPosition = new THREE.Vector3();

	setInterval(evaluate, 200);

	function evaluate() {

		if (!window.MAIN_AVATAR) {
			return
		}
		let camera = MAIN_AVATAR_CONTROL.camera;
		if (!camera) {
			return
		}

		// Paso 1: Obtener la posición de la cámara y configurar el raycaster
		const camaraPosition = new THREE.Vector3();
		camera.getWorldPosition(camaraPosition);

		const raycaster = new THREE.Raycaster();
		const centroPantalla = new THREE.Vector2(0, 0);

		detectarInterseccion();

		// Paso 2: Crear una función para detectar intersecciones con el objeto
		function detectarInterseccion() {
			// Actualizar el raycaster desde la posición de la cámara y la dirección de la pantalla
			raycaster.setFromCamera(centroPantalla, camera);

			// Calcular las intersecciones con los objetos
			const intersecciones = raycaster.intersectObjects(INTERACTIVE_OBJECTS);

			// Comprobar si hay intersecciones
			if (intersecciones.length > 0) {

				// Objeto interceptado
				const objInt = intersecciones[0].object;

				// Si hay un objeto activo, retornamos
				if(window.ACTIVE_OBJECT) {
					// @TODO: Evaluar si el objeto activo puede interactuar con otros objetos.
					return;
				}

				// Vemos que tan lejos esta el objeto
				if(!evalDistance(camera, objInt, objInt.interactiveOptions.focusDistance)) {

					// Si había un objeto en foco, lo limpiamos
					if(window.FOCUS_OBJECT) { clearFocus() }
					return false;
				}

				// Si el objeto ya tenía el foco, reornamos
				if(Object.is(window.FOCUS_OBJECT, objInt)) {
					return false;
				}

				// Si había un objeto distinto en foco, lo limpiamos
				if(window.FOCUS_OBJECT) { clearFocus() }

				innerFocus(objInt);

			}
			else {

				// Si había un objeto en foco, quitamos
				if(window.FOCUS_OBJECT) { clearFocus() }

			}
		}

	}
}

function evalDistance(camera, object, focusDistance) {

	// Calcular la distancia entre la posición de la cámara y la posición del objeto intersectado
    const camaraPosition = new THREE.Vector3();
    camera.getWorldPosition(camaraPosition);
    const distancia = camaraPosition.distanceTo(object.position);

	let near = focusDistance || NEAR_POS;

    if (distancia < near) { return true } else { return false }

}


// Focus

function innerFocus(object) {

	let opts = object.interactiveOptions;
	if(!opts) { return }

	// Calculamos si la acción actual es compatible con la acción en curso
	if(ACTIVE_ACTION) {
		if(!opts.contexts || (!opts.contexts.includes(ACTIVE_ACTION))) {
			console.log('La acción actual no se ejecuta en este contexto.');
			return;
		}
	}

	// Si el contexto de ejecución es global, verificamos que no este seteada la propiedad excludeGlobalContext
	else if(opts.excludeGlobalContext) {
		console.log('La acción actual no se ejecuta en este contexto.');
		return;
	}

	// Establecemos el foco en el objeto
	window.FOCUS_OBJECT = object;
	showInteractiveOptions(object);

	let focusCallback = opts.focusCallback;
	if(focusCallback) {  focusCallback(window.FOCUS_OBJECT) }
}

function clearFocus() {
	if(!FOCUS_OBJECT) { return }
	let blurCallback = FOCUS_OBJECT.interactiveOptions.blurCallback;
	if(blurCallback) { blurCallback(window.FOCUS_OBJECT) }
	window.FOCUS_OBJECT = null;
	hideInteractiveOptions();
}


// Interactive options

function showInteractiveOptions(object) {

	let opts = object.interactiveOptions;

	document.getElementById('interactive-instruction').textContent = opts.instructions || 'Click';
	document.getElementById('interactive-icon').textContent = opts.icon || 'mouse';
	document.body.setAttribute('focus-interactive-object', true);

}

function hideInteractiveOptions() {

	document.body.removeAttribute('focus-interactive-object');

}


// Interacción

function startInteraction(obj) {

	// obj es opcional
	if(obj) { FOCUS_OBJECT = obj }

	// Si la pantalla no esta bloqueada, retornamos
	if(!isLock) { return }

	if(!FOCUS_OBJECT) { return }

	let opts = FOCUS_OBJECT.interactiveOptions;
	if(!opts) { return }
	let startInteraction = opts.startInteraction;

	clearFocus();
	window.ACTIVE_OBJECT = window.FOCUS_OBJECT;
	window.ACTIVE_ACTION = opts.actionName;

	// Iniciamos interacción

	if(startInteraction) { startInteraction(window.FOCUS_OBJECT) }
}

function stopInteracion() {
	if(!ACTIVE_OBJECT) { return }
	let stopInteractionCallback = ACTIVE_OBJECT.interactiveOptions.stopInteraction;
	stopInteractionCallback();
	window.ACTIVE_OBJECT = null;
	window.ACTIVE_ACTION = null;
}


enableInteractions();

document.body.addEventListener('click', function(){
	startInteraction();
});

window.startInteraction = startInteraction;
window.stopInteracion = stopInteracion;

export { implementInteraction }
