import TYPES from './types.js';
import { loadThirdAvatar } from '../avatars/third.js';

async function downEvent(eventType, data) {

	let trs = TRIGGERS[eventType];
	if(!trs) { return }

	for(let inx = 0; inx < trs.length; inx++) {
		trs[inx](data);
	}

}

const TRIGGERS = {
	[TYPES.PRESENTATION]: [

	],
	[TYPES.INIT_STATUS]: [

	],
	[TYPES.REMOVE_PLAYER]: [

	],
	[TYPES.STATUS]: [
		updateLocalStatus()
	]
}

async function updateLocalStatus() {

}

export { downEvent }
