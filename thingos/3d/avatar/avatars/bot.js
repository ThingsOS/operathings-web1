import { loadModel } from './load.js';

async function loadBotAvatar(avatarID) {
	let mainGtlf = await loadModel(avatarID);
	return mainGtlf;
}

export { loadBotAvatar }
