//import { importCSS } from 'https://fw.workos.app/scripts/utils/css/import.js';

//importCSS('style.css', import.meta.url);

class GyroScope extends HTMLElement {

	constructor(config={}) {
		super();

		let childs = this.children;
		var angle = parseFloat(this.getAttribute('angle')) || (config.angleInitial ?? 0);
		var anglePart = 6.28/childs.length;

		this.slideTime = 10;
		this.slideAngle = 0.003;

		for(let inx = 0; inx < childs.length; inx++) {

			requestAnimationFrame(function(){
				this.position(childs[inx], angle);
				angle = angle + anglePart;
			 }.bind(this))
		}

	}
	position(element, angle) {
		// Calculamos las nuevas coordenadas del objeto en función del ángulo actual
		let left = element.offsetHeight / 2;
		  var x = (this.centerX + this.radio * Math.cos(angle)) - left;
		  var y = (this.centerY + this.radio * Math.sin(angle)) - left;

		  // Aquí puedes actualizar la posición del objeto en tu código
		  element.style.left = x + "px";
		  element.style.top = y + "px";

		  // Aumentamos el ángulo para la siguiente animación
		  angle += this.slideAngle;

		  // Llamamos a la función de animación de nuevo para la siguiente fotograma
		  setTimeout(function(){
			  requestAnimationFrame(function(){
				  this.position(element, angle);
			  }.bind(this))
			}.bind(this), this.slideTime);
	}
	play() {

	}
	pause() {

	}
	get centerX() {
		return this.offsetLeft + this.offsetWidth / 2;;
	}
	get centerY() {
		return this.offsetTop + this.offsetHeight / 2;;
	}
	get radio() {
		return this.offsetHeight/2;
	}
}
customElements.define('gyro-scope', GyroScope);
