import { loadModel } from './load.js';

async function loadThirdAvatar(avatarID) {
	let mainGtlf = await loadModel(avatarID);
	return mainGtlf;
}

export { loadThirdAvatar }
