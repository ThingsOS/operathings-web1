import { downEvent } from './hand.js';
import TYPES from './types.js';

var CID = null;

async function startConnection() {

	const ws = new WebSocket('wss://wss.workos.cloud:7000');
	window.ws = ws;
	window.wsClose = function() { ws.close() };
	ws.sendObj = function(obj) {
		//obj.cid = CID;
		ws.send(JSON.stringify(obj));
	}

	ws.onopen = async function() {
		console.log('Conexión WebSocket establecida.');
		ws.onmessage = proxy;
		init();
	};
	ws.onclose = () => {
		console.log('Conexión WebSocket cerrada.');
	};

}
async function init() {
	ws.sendObj({
		type: TYPES.PRESENTATION,
		worldID: 'bar-de-nico',
		data: { name: 'AA' }
	});

	/*
	setInterval(function(){
		x++;
		z++;
		ws.sendObj({
			type: TYPES.STATUS,
			path: '/players/'+CID,
			data: { x: x, z: z }
		})
	}, 2000)
	*/
}

async function proxy(event) {

	// Recibe y parsea un mensaje
	const message = JSON.parse(event.data);
	//console.log('Nuevo mensaje:', message);

	// Recibe una actualización de estado
	if (message.type === TYPES.STATUS) {
		console.log('Status modificado', message.data);
	}

	// Recibe una presentación de un jugador que se acaba de conectar
	else if(message.type === TYPES.PRESENTATION) {
		console.log('Nuevo jugador conectado', message.data);
	}

	// Recibe información del estado del servidor hasta el momento
	else if (message.type === TYPES.INIT_STATUS) {
		console.log('Data inicial', message.data);
		window.CID = message.yourcid;
	}

	// Un player se fue
	else if (message.type === TYPES.REMOVE_PLAYER) {
		console.log('Jugador removido', message.data);
	}

	downEvent[message.type, message.data];

}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export { startConnection }
