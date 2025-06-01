import { loadModel } from './load.js';
import { StatusCaster } from '../../live/cast.js';

async function loadMainAvatar(avatarID) {

	avatarID ??= window.localStorage.getItem('avatar-id');
	if(!avatarID) {
		window.location.href = '/3d/bar/setup/avatar/index.html';
		return;
	}

	// Obtenemos el Modelo 3D
	let mainGtlf = await loadModel(avatarID);
	let avatar = mainGtlf.scene;
	window.MAIN_AVATAR = avatar;
	window.MAIN_AVATAR_GLTF = mainGtlf;

	// Agregamos controles de movimiento
	let avatarControl = avatar.control;
	avatarControl.anim = false;
	avatarControl.takeControl();
	window.MAIN_AVATAR_CONTROL = avatarControl;

	// Emitimos todas las acciones del avatar
	const pid = '/players/' + window.CID;
	let caster = new StatusCaster(pid);

	avatarControl.onWalk = function(walk){
		let r = { walk }
		if(walk.f === 0 || walk.r === 0) {
			r.pos = avatarControl.position;
		}
		caster.cast(r);
	};

	avatarControl.onJump = function(pack){
		caster.cast({jump:pack});
	};

	avatarControl.onTurn = function(turn){
		let r = { turn }
		if(turn.y === 0) {
			r.rot = avatar.rotation;
		}
		caster.cast(r);
	};

	return mainGtlf;
}

export { loadMainAvatar }
