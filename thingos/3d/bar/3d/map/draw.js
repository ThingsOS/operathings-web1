import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';

async function loadMap(nameMap) {

	var basePath = '/3d/bar/3d/lib/maps/' + nameMap;
	await loadGTLF(basePath);

	var basePath = '../lib/maps/' + nameMap;
	await loadScript(basePath);

}

async function loadGTLF(basePath) {
	try {

		const loader = new THREE.GLTFLoader();
		let path = basePath + '/main.gltf';

		loader.load(path, function (gltf) {
			scene.add(gltf.scene);
		}, undefined);

	} catch (e) {
		return;
		console.error(e);
		console.error('Error Stack Trace:', e.stack);
    	console.error('Error Message:', e.message);
	}
}

async function loadScript(basePath) {
	try {
		let m = await import (basePath + '/script.js');
		return await m.openMap();
	} catch (e) {
		console.error(e);
		console.error('Error Stack Trace:', e.stack);
    	console.error('Error Message:', e.message);
	}
}

export {
	loadMap
}
