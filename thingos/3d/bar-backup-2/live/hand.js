import TYPES from './types.js';
import { loadThirdAvatar } from '../3d/avatars/third.js';

window.PLAYERS_DATA = {};

async function downEvent(eventType, data) {

	let trs = TRIGGERS[eventType];
	if(!trs) { return }

	let path = data.path;
	if(path && path.endsWith(window.CID)) {
		console.log('Data same player ignored');
		return;
	}

	for(let inx = 0; inx < trs.length; inx++) {
		trs[inx](data.path, data);
	}

}

const TRIGGERS = {
	[TYPES.PRESENTATION]: [
		async function(path, data) {

			await downPlayer(path, data);

		}
	],
	[TYPES.REMOVE_PLAYER]: [
		async function(path, data) {

			let obj = OBJS[path];
			console.info('Remover jugador', obj);
			if(!obj) {
				console.warn('No existe el objeto con path', path);
				return;
			}

			depthRemove(obj);

			function depthRemove(obj) {
				if(!obj) { return }
				if(obj.links) {
					for(let inx = 0; inx < obj.links.length; inx++) {
						depthRemove(obj.links[inx]);
					}
				}
				scene.remove(obj);
			}

			OBJS[path] = null;

		}

	],
	[TYPES.INIT_STATUS]: [

		async function(path, data) {

			// Cargamos los jugadores existentes
			PLAYERS_DATA = data.playersData;
			let pData = data.playersData;
			for(let cid in pData) {
				await downPlayer('/players/'+cid, pData[cid]);
			}

			// Actualizamos los estados existentes
			let status = data.status;
			for(let path in status) {
				updateLocalStatus(path, status[path]);
			}

		}

	],
	[TYPES.STATUS]: [
		async function(path, data) {

			updateLocalStatus(path, data);

		}
	]
}

async function downPlayer(path, data) {

	if(path && path.endsWith(window.CID)) {
		console.log('WC', window.CID);
		console.log('Data same player ignored');
		return;
	}

	// Creamos el avatar del nuevo
	let thirdAvatar = await loadThirdAvatar('64acd03d93a21c1aa5d4b5ed');
	let avatar = thirdAvatar.scene;
	OBJS[path] = avatar;

}

async function updateLocalStatus(path, statusPack) {

	let obj = OBJS[path];
	if(!obj) {
		console.warn("No hay objeto con path", path);
		return;
	}

	for(let key in statusPack) {
		let a = ANIMATIONS[key];
		if(a) {
			a(obj, statusPack[key], statusPack)
		}
	}

}

const ANIMATIONS = {

	'walk': async function(obj, walk) {
		let ctrl = obj.control;
		console.info('walking', walk);

		// La primer línea habilita la animaxión y la segunda ejecuta la animacion
		if(walk.f === 1) { ctrl.startForward() }
		if(walk.f === -1) { ctrl.startBackward() }
		if(walk.f === 0) {  ctrl.stopForward(); ctrl.stopBackward(); }

		if(walk.r === 1) { ctrl.startRigth() }
		if(walk.r === -1) { ctrl.startLeft() }
		if(walk.r === 0) { ctrl.stopRigth(); ctrl.stopLeft(); }

	},

	'jump': async function(obj, jump) {
		let ctrl = obj.control;
		console.info('jump', jump);
		ctrl.jump();
	},

	'turn': async function(obj, turn) {

		obj.control.turnStart(turn.y, turn.v);

	},

	'rot': async function(obj, rot) {
		console.info('rot', rot);
		obj.control.turnTo(rot);
	},

	'pos': async function(obj, pos) {
		console.log('pos', pos);
		obj.control.posTo(pos);
	}

}

export { downEvent }
