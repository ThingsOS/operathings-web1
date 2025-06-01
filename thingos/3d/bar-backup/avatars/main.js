import { loadModel } from './load.js';
import { AvatarControl } from './control/acontrol.js';

async function loadMainAvatar(avatarID) {

	// Obtenemos el Modelo 3D
	let mainGtlf = await loadModel(avatarID);
	let avatar = mainGtlf.scene;

	// Agregamos controles de movimiento
	let avatarControl = new AvatarControl(avatar);

	// Guardamos el avatar y su control en el global
	window.MAIN_AVATAR = mainGtlf.scene;
	window.MAIN_AVATAR_GLTF = mainGtlf;
	window.MAIN_AVATAR_CONTROL = avatarControl;

	return mainGtlf;
}

export { loadMainAvatar }
