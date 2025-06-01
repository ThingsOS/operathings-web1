import { loadModel } from './load.js';

async function loadThirdAvatar(avatarID) {
	let mainGtlf = await loadModel(avatarID);
	mainGtlf.scene.control.anim = true;
	return mainGtlf;
}

export { loadThirdAvatar }
