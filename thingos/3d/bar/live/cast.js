import TYPES from './types.js';

async function castStatus(data) {
	ws.sendObj({
		type: TYPES.STATUS,
		data: data
	})
}

class StatusCaster {

	constructor(path) {
		this.path = path;
	}

	trackObject(obj) {

	}

	startCapture(initPos, initRot) {

	}

	endCapture() {}

	async cast(data) {

		let dataSend = Object.assign({path: this.path}, data);
		await castStatus(dataSend);

	}

}

export { castStatus, StatusCaster }
