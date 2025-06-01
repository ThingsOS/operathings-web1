import { loadModel } from './load.js';
import { setupAvatarControls } from './main-controls.js';

async function loadMainAvatar(avatarID) {
	let mainGtlf = await loadModel(avatarID);
	setupAvatarControls(mainGtlf);
	return mainGtlf;
}

export { loadMainAvatar }
