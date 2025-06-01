import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/PointerLockControls';

window.isLock = false;
window.lockControls = function() { MAIN_AVATAR_CONTROL.controls.lock() };
window.unlockControls = function() { MAIN_AVATAR_CONTROL.controls.unlock() };

// AvatarControl permite dotar a los avatares de controles de movimiento y animaciones
class AvatarControl {

	constructor(avatar) {

		this.objects = [];

		this.setAvatar(avatar);
		this.anim = false;

		this.mForward = false;
		this.mBackward = false;
		this.mLeft = false;
		this.mRigth = false;
		this.canJump = false;
		this.isTurn = false;

		this.prevTime = performance.now();
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();

		this.camera = null;
		this.controls = null;
		this.raycaster = null;

		this.init();
		this.animate();

	}

	setAvatar(avatar) {
		this.avatar = avatar;
	}

	init() {
		this.camera = new THREE.PerspectiveCamera(
			75, window.innerWidth / window.innerHeight, 1, 1000
		);
		this.camera.position.y = 10;

		/*const helper = new THREE.CameraHelper(this.camera);
		this.cameraHelper = helper;
		scene.add(helper);*/

		this.controls = new PointerLockControls(this.camera, document.head);


		scene.add(this.controls.getObject());

		this.raycaster = new THREE.Raycaster(
			new THREE.Vector3(),
			new THREE.Vector3(0, -1, 0),
			0,
			10
		);

		this.avatar.links = this.links;

	}

	clear() {
		scene.remove(this.camera);
		scene.remove(this.controls.getObject())
	}

	// Esta funcion permite tomar posesion del AVATAR
	takeControl() {

		this.controls = new PointerLockControls(this.camera, document.body);
		/*this.controls.addEventListener('change', function(e){
			console.log(e);
		})*/

		document.body.addEventListener('click', function () {
			this.controls.lock();
		}.bind(this));

		this.controls.addEventListener("lock", function () {
			// Al quedar bloqueado
			window.isLock = true;
		});

		this.controls.addEventListener("unlock", function () {
			// Al desbloquear
			window.isLock = false;
		});

	}

	// Animaciones
	startForward() {
		if(this.mForward) { return }
		this.mForward = true;
		if(this.onWalk) { this.onWalk({"f":1}) }
	}
	startLeft() {
		if(this.mLeft) { return }
		this.mLeft = true;
		this.mRigth = false;
		if(this.onWalk) { this.onWalk({"r":-1}) }
	}
	startBackward() {
		if(this.mBackward) { return }
		this.mBackward = true;
		if(this.onWalk) { this.onWalk({"f":-1}) }
	}
	startRigth() {
		if(this.mRigth) { return }
		this.mRigth = true;
		this.mLeft = false;
		if(this.onWalk) { this.onWalk({"r":1}) }
	}

	stopForward() {
		if(!this.mForward) { return }
		this.mForward = false;
		if(this.onWalk) { this.onWalk({"f":0}) }
	}
	stopLeft() {
		if(!this.mLeft) { return }
		this.mLeft = false;
		if(this.onWalk) { this.onWalk({"r":0}) }
	}
	stopBackward() {
		if(!this.mBackward) { return }
		this.mBackward = false;
		if(this.onWalk) { this.onWalk({"f":0}) }
	}
	stopRigth() {
		if(!this.mRigth) { return }
		this.mRigth = false;
		if(this.onWalk) { this.onWalk({"r":0}) }
	}

	posTo(pos) {
		this.controls.getObject().position.x = pos.x;
		this.controls.getObject().position.y = pos.y;
		this.controls.getObject().position.z = pos.z;
	}

	turnStart(y, v) {
		this.ignoreCamaraTurn = true;
		if(y === 0) { this.turnStop() }

	}
	turnStop() {}
	turnTo(rot) {
		this.ignoreCamaraTurn = true; // ESTO ES UNA GUASADA
		if(!rot) { return }
		animateRotationTo(rot.y||rot._y, this.avatar, 200);
	}

	jump() {
		if (this.canJump === true) this.velocity.y += 350;
		this.canJump = false;
		if(this.onJump) { this.onJump({"h":1}) }
	}

	// @TODO: tendriamos que hacer que cuando no hay una animación ejecutandose, no procese los cálculos (isPlaying)
	animate() {
		setTimeout(() => {
			requestAnimationFrame(() => this.animate());
		}, 10);

		const time = performance.now();

		if (this.controls.isLocked === true||this.anim) {

			this.raycaster.ray.origin.copy(this.controls.getObject().position);
			this.raycaster.ray.origin.y -= 10;

			const intersections = this.raycaster.intersectObjects(
				this.objects,
				false
			);

			const onObject = intersections.length > 0;

			const delta = (time - this.prevTime) / 1000;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

			this.velocity.y -= 9.8 * 100.0 * delta;

			this.direction.z = Number(this.mForward) - Number(this.mBackward);
			this.direction.x = Number(this.mRigth) - Number(this.mLeft);
			this.direction.normalize();

			if (this.mForward || this.mBackward)
				this.velocity.z -= this.direction.z * 400.0 * delta;
			if (this.mLeft || this.mRigth)
				this.velocity.x -= this.direction.x * 400.0 * delta;

			if (onObject === true) {
				this.velocity.y = Math.max(0, this.velocity.y);
				this.canJump = true;
			}

			this.controls.moveRight(-this.velocity.x * delta);
			this.controls.moveForward(-this.velocity.z * delta);

			// Sincronizar con avatar
			let avatar = this.avatar;
			let cobj = this.controls.getObject();
			avatar.position.x = cobj.position.x;
			avatar.position.z = cobj.position.z;
			avatar.position.y = cobj.position.y - 10;

			// Sincronizar giro
			if(!this.ignoreCamaraTurn) {

				this.camera.getWorldDirection(this.direction);
				const angle = Math.atan2(this.direction.x, this.direction.z);
				avatar.rotation.y = angle;

				// @TODO: Pasar estre fragmento a una función a parte
				let aAngle = angle.toFixed(1);
				if(this.prevRot !== aAngle) {

					if(this.isTurn === false) {
						//console.log('Giro!');
						this.isTurn = true;
					}

					let nd = detectDirectionChange(angle, this.prevRot, this.turnDir);

					if(this.turnDir !== nd) {
						//console.log('Cambio de dirección', nd);
						this.turnDir = nd;
						if(this.onTurn) { this.onTurn({y:nd}) }
					}
					// MI VERSION
					/*
					if(aAngle < this.prevRot) {
						console.log('GIRO <', aAngle);
						if(this.prevDir !== -1) {
							console.log('CAMBIO DE SENTIDO de 1 a -1');
							this.prevDir = -1;
						}


					}
					else {
						console.log('GIRO >', aAngle);
						this.prevDir = 1;
						if(this.prevDir !== 1) {
							console.log('CAMBIO DE SENTIDO de -1 a 1');
							this.prevDir = 1;
						}
					}
					*/
				}
				else {
					// @TODO: Para saber si dejo de girar, hacer una comprobación exacta
					if(this.prevRotExact === angle && this.isTurn) {
						console.log('Dejo de girar');
						this.turnDir = 0;
						this.isTurn = false;
						if(this.onTurn) { this.onTurn({y:0}) }
					 }
				}
				this.prevRot = aAngle;
				this.prevRotExact = angle;


			}

			// ESTO SINCRONIZA AL REVEZ, DESDE EL AVATAR HACIA LA CAMARA. DEBERIA CAMBIAR. Y NO MANDA EVENTOS PORQUE NO ES NECESARIO
			else {

				//this.camera.lookAt(this.avatar.position);
				// Obtén la matriz de transformación del objeto
				var matrix = new THREE.Matrix4();
				matrix.extractRotation(this.avatar.matrixWorld);

				// Establece la rotación de la cámara desde la matriz del objeto
			 	this.camera.setRotationFromMatrix(matrix);

				this.camera.rotateY(Math.PI);

			}

			// Creo que es el salto
			this.controls.getObject().position.y += this.velocity.y * delta;

			if (this.controls.getObject().position.y < 10) {
				this.velocity.y = 0;
				this.controls.getObject().position.y = 10;
				this.canJump = true;
			}
		}

		this.prevTime = time;
	}

	get position() {
		return this.controls.getObject().position;
	}

	get links() {

		return [this.camera, this.controls.getObject(), this.cameraHelper];

	}

	get isPlaying() {
		return this.mForward||this.mBackward||this.mLeft||this.mRigth||(!this.hasJump)
	}

}

function animateRotationTo(targetRotationY, object, duration) {
  var startRotationY = object.rotation.y;
  var direction = Math.sign(targetRotationY - startRotationY);
  var distance = Math.abs(targetRotationY - startRotationY);
  var startTime = performance.now();

  function updateRotation() {
    var elapsedTime = performance.now() - startTime;
    var progress = elapsedTime / duration;
    var currentRotationY = startRotationY + distance * progress * direction;

    if (progress < 1) {
      object.rotation.y = currentRotationY;
      requestAnimationFrame(updateRotation);
    } else {
      object.rotation.y = targetRotationY;
    }
  }

  requestAnimationFrame(updateRotation);
}

function detectDirectionChange(currentRotation, previousRotation, currentDirection) {
  var rotationDelta = currentRotation - previousRotation;

  if (Math.abs(rotationDelta) > Math.PI) {
    // El objeto ha pasado por el punto de transición entre los dos extremos
    if (currentRotation > 0) {
      rotationDelta -= Math.PI * 2;
    } else {
      rotationDelta += Math.PI * 2;
    }
  }

  var newDirection = Math.sign(rotationDelta);

  if (newDirection !== currentDirection) {
    currentDirection = newDirection;

    // Realiza cualquier lógica adicional aquí
    // ...
  }

  return currentDirection;
}

export { AvatarControl }
