import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { AvatarControl } from './control/acontrol.js';

const API_KEY = 'sk_live_jyMxl9X9a5Z97WofUHVasomeI54NUN2Wdsdi';

async function loadModel(avatarID) {

	let gtlf = await getModel(avatarID);
	let avatar = gtlf.scene;
	let avatarControl = new AvatarControl(avatar);
	avatar.control = avatarControl;
	return gtlf;

}

async function getModel(avatarID) {

	return new Promise(function(resolve, reject){
		const URL = `https://models.readyplayer.me/${avatarID}.glb?quality=high`;
		const loader = new GLTFLoader();
		loader.load(URL, async function(gltf){
			let character = gltf.scene;
			let r = await window.addToScene(character);
			gltf.scene.scale.set(6, 6, 6);
			//gltf.scene.rotateY(Math.PI);
			resolve(gltf);
		});
	});
}

export { loadModel }


/*
const result = await getModel('6185a4acfb622cf1cdc49348');
console.log(result);

async function getModel(avatarID) {

	const URL = `https://models.readyplayer.me/${avatarID}.glb?quality=high`;
	let response = await fetch(URL, { headers: { 'x-api-key': API_KEY } });
	console.log(response);
	return { code: response.status, body: JSON.parse(await response.text()) };
}
*/
