class RunnerControl extends HTMLElement {
	constructor(elemento) {
		super();
		this.xInicio = null;
		this.yInicio = null;

		this.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
		this.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
		this.addEventListener('touchend', this.handleStop.bind(this), false);
	}

	handleTouchStart(event) {
		const primerToque = event.touches[0];
		this.xInicio = primerToque.clientX;
		this.yInicio = primerToque.clientY;
	}

	handleTouchMove(event) {
		if (!this.xInicio || !this.yInicio) {
			return;
		}

		const xActual = event.touches[0].clientX;
		const yActual = event.touches[0].clientY;

		const diferenciaX = this.xInicio - xActual;
		const diferenciaY = this.yInicio - yActual;

		if (Math.abs(diferenciaX) > Math.abs(diferenciaY)) {
			if (diferenciaX > 0) {
				// Movimiento hacia adelante
				console.log('Hacia adelante');
				if(MAIN_AVATAR_CONTROL) { MAIN_AVATAR_CONTROL.startForward() }
			} else {
				// Movimiento hacia atrás
				console.log('Hacia atrás');
				if(MAIN_AVATAR_CONTROL) { MAIN_AVATAR_CONTROL.startBackward() }
			}
		}

		this.xInicio = null;
		this.yInicio = null;
	}

	handleStop() {
		if(MAIN_AVATAR_CONTROL) {
			MAIN_AVATAR_CONTROL.stopForward();
			MAIN_AVATAR_CONTROL.stopBackward();
		}
	}

}
customElements.define('runner-control', RunnerControl);

export {
	RunnerControl
}
