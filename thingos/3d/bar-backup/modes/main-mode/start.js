import { StatusCaster } from '../../live/cast.js';
let caster = new StatusCaster();

function setupMainMode() {
	let avatarControl = window.MAIN_AVATAR_CONTROL;
	events(avatarControl);
	SELECTED_VISOR.visorRenderer.addVisorCamera(avatarControl.camera);
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

export { setupMainMode }
