import { importCSS } from '../../utils/importcss.js';
importCSS('style.css', import.meta.url);

const subdomain = 'eventy'; // Replace with your custom subdomain

function openAvatarChoiser() {

	const avatarChoiser = document.createElement('avatar-choiser');
	document.body.appendChild(avatarChoiser);

	const frame = document.createElement('iframe');
	frame.setAttribute('allow', 'camera *; microphone *; clipboard-write');
	frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
	avatarChoiser.appendChild(frame);

	window.addEventListener('message', subscribe);
	document.addEventListener('message', subscribe);

	function subscribe(event) {
		const json = parse(event);

		if (json?.source !== 'readyplayerme') {
			return;
		}

		// Susbribe to all events sent from Ready Player Me once frame is ready
		if (json.eventName === 'v1.frame.ready') {
			frame.contentWindow.postMessage(
				JSON.stringify({
					target: 'readyplayerme',
					type: 'subscribe',
					eventName: 'v1.**'
				}),
				'*'
			);
		}

		// Get avatar GLB URL
		if (json.eventName === 'v1.avatar.exported') {
			console.log(`Avatar URL: ${json.data.url}`);
			document.body.innerHTML = `Avatar URL: ${json.data.url}`;
			this.localStorage.setItem('avatar-id', json.data.url.replace('https://models.readyplayer.me/', '').replace('.glb', ''))
			frame.remove();
			window.location.pathname = '/3d/bar/index.html';
		}

		// Get user id
		if (json.eventName === 'v1.user.set') {
			console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
		}
	}

}

function parse(event) {
	try {
		return JSON.parse(event.data);
	} catch (error) {
		return null;
	}
}

export { openAvatarChoiser }
