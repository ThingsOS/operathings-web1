import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';

const NEAR_POS = 100;
const FOCUS_DISTANCE = 20;

// Guaramos los objetos que estan enfocados o que estan siendo controlados
window.FOCUS_OBJECT = null;
window.ACTIVE_OBJECT = null;
window.ACTIVE_ACTION = null;

const INTERACTIVE_OBJECTS = [];

// Cada interactive puede tener:
// - actionName (Nombre que identifica la acción y se pasa a la global ACTIVE_ACTION cuando inicia la interacción)
// - toContexts
// - forContexts

// - toState (Estado al que cambiará automáticamente el objeto)
// - forStates (Estados para los que esta habilitada la interacción)

// - focusCallback
// - blurCallback
// - startInteraction
// - stopInteraction
// - focusDistance (distancia máxima a la que se puede iniciar una interacción con el objeto)

// El objeto puede tener dentro de su propiedad interactives:
// - actionState (identifica la acción que se esta ejecutando en el objeto, por ejemplo indica si un video esta reproduciendose. A diferencia del ACTIVE_ACTION global que indica la acción que esta ejecutando el jugador actual, la actionState es en relación al objeto.)
// - playerActive (identifica al jugador que esta haciendo uso del objeto)

function implementInteraction(object, interactives) {
	INTERACTIVE_OBJECTS.push(object);

	interactives ??= [];
	interactives.playerActive = null;
	interactives.actionState = null;
	interactives.lastActionState = null;

	object.interactives = interactives;
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

				// Vemos que tan lejos esta el objeto
				if(!evalDistance(camera, objInt)) {
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

	let opts = getInteraction(object);
	if(!opts) { return }

	// Establecemos el foco en el objeto
	window.FOCUS_OBJECT = object;
	showInteractiveOptions(opts);

	let focusCallback = opts.focusCallback;
	if(focusCallback) {  focusCallback(window.FOCUS_OBJECT) }
}

function clearFocus() {
	if(!FOCUS_OBJECT) { return }

	let opts = getInteraction(FOCUS_OBJECT);
	if(!opts) { return }

	let blurCallback = opts.blurCallback;
	if(blurCallback) { blurCallback(window.FOCUS_OBJECT) }
	window.FOCUS_OBJECT = null;
	hideInteractiveOptions();
}


// Interactive options

function showInteractiveOptions(inter) {

	inter = inter || {};

	document.getElementById('interactive-instruction').textContent = inter.instructions || 'Click';
	document.getElementById('interactive-icon').textContent = inter.icon || 'mouse';
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

	let opts = getInteraction(FOCUS_OBJECT);
	if(!opts) { return }

	window.ACTIVE_OBJECT = window.FOCUS_OBJECT;
	window.ACTIVE_ACTION = opts.actionName;

	clearFocus();

	// Si la interacción tiene un estado definido en state, lo seteamos
	if(typeof opts.toState !== 'undefined') {
		console.log(ACTIVE_OBJECT, ACTIVE_ACTION);
		changeActionState(window.ACTIVE_OBJECT, opts.toSate)
	}

	//hideInteractiveOptions();

	// Iniciamos interacción
	let startInteraction = opts.startInteraction;
	if(startInteraction) { startInteraction(window.FOCUS_OBJECT) }


}

function skipInteraction() {

	window.ACTIVE_OBJECT = null;
	window.ACTIVE_ACTION = null;

	clearFocus();
	hideInteractiveOptions();

	let opts = getInteraction(ACTIVE_OBJECT);
	if(opts) {
		let stopInteractionCallback = opts.stopInteraction;
		stopInteractionCallback();
	}

}


// Estado de acción
function changeActionState(obj, state) {
	obj.interactives.lastActionState = state;
	obj.interactives.actionState = state;
}

function getActionState(obj) {
	return obj.interactives.actionState;
}


// Estado de jugador

function getUserPlayer() {

}

function setUserPlayer() {

}


// Obtiene la interacción indicada según el objeto, el estado y el contexto

function getInteraction(obj, contextAction, actionState) {

	if(!obj) { return }

	let inters = obj.interactives;
	contextAction ??= ACTIVE_ACTION;

	actionState ??= inters.actionState;

	for(let inx = 0; inx < inters.length; inx++) {
		let int = inters[inx];

		if(!contextAction && int.excludeGlobalContext) { continue }

		if(!contextAction && !int.contexts ||
		   int.contexts && int.contexts.includes(contextAction)) {

			// Evaluar si esta habilitado para este estado
			if(int.forStates) { if(!int.forStates.includes(actionState)) { continue } }

			return int
		}
	}

}


enableInteractions();

document.body.addEventListener('click', function(){
	startInteraction();
});

window.changeActionState = changeActionState;
window.getActionState = getActionState;
window.startInteraction = startInteraction;
window.skipInteraction = skipInteraction;

export { implementInteraction }
