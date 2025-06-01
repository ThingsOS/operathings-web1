function addPlayer() {

	var name = playerName.value;

	var player = document.createElement('div');
	player.className = 'player';
	player.textContent = name;
	cancha.appendChild(player)

}
