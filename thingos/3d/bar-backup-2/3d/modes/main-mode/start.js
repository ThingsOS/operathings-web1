import { RunnerControl } from './ui/run.js';
importCSS('ui/style.css', import.meta.url);
importCSS('style.css', import.meta.url);

function setupMainMode() {
	let avatarControl = window.MAIN_AVATAR_CONTROL;
	events(avatarControl);
	SELECTED_VISOR.visorRenderer.addVisorCamera(avatarControl.camera);
	addCenterPointer();

	if (isDispositivoTactil()) {
		document.body.setAttribute('is-mobile', true);
	} else {
		document.body.removeAttribute('is-mobile');
	  console.log('No estás en un dispositivo táctil');
	}
}

function events(avatarControl) {

	document.addEventListener('keydown', function (event) {

		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				avatarControl.startForward();
				break;

			case 'ArrowLeft':
			case 'KeyA':
				avatarControl.startLeft();
				break;

			case 'ArrowDown':
			case 'KeyS':
				avatarControl.startBackward();
				break;

			case 'ArrowRight':
			case 'KeyD':
				avatarControl.startRigth();
				break;

			case 'Space':
				avatarControl.jump();
				break;

		}

	});

	document.addEventListener('keyup', function (event) {

		switch (event.code) {

			case 'ArrowUp':
			case 'KeyW':
				avatarControl.stopForward();
				break;

			case 'ArrowLeft':
			case 'KeyA':
				avatarControl.stopLeft();
				break;

			case 'ArrowDown':
			case 'KeyS':
				avatarControl.stopBackward();
				break;

			case 'ArrowRight':
			case 'KeyD':
				avatarControl.stopRigth();
				break;

		}

	});

}

function isDispositivoTactil() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}


function touchMode() {

	let run = new RunnerControl(document.body);
	document.body.appendChild(run);

}

function importCSS(urlRelativa, urlBase) {
  var urlAbsoluta = new URL(urlRelativa, urlBase);
  var elemento = document.createElement('link');
  elemento.rel = 'stylesheet';
  elemento.href = urlAbsoluta.href;
  document.head.appendChild(elemento);
}

function addCenterPointer() {

	let p = document.createElement('div');
	p.className = 'center-point';
	document.body.appendChild(p);

}

export { setupMainMode }
