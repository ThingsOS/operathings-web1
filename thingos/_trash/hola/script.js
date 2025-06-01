window.addEventListener('load', function(){
	start();
});

var globalMask;

function start() {

	let mask =  document.createElement('div');
	document.body.appendChild(mask);
	mask.style.display = 'flex';
	mask.style.alignItems = 'center';
	mask.style.justifyContent = 'center';
	mask.style.position = 'absolute';
	mask.style.width = '100%';
	mask.style.height = '100%';
	mask.style.backgroundColor = 'rgba(0, 0, 0, 0.30)';
	mask.style.zIndex = '100';

	globalMask = mask;

	let notice = document.createElement('div');
	notice.style.display = 'flex';
	notice.style.flexDirection = 'column';
	notice.style.backgroundColor = 'white';
	notice.style.padding = "20px";
	notice.style.borderRadius = "10px";
	notice.style.borderStyle = 'solid';
	notice.style.borderWidth = '2px';
	notice.style.borderColor = 'green';
	notice.style.maxWidth = '500px';
	mask.appendChild(notice);

	let p = document.createElement('p');
	p.style.margin = "0px";
	p.style.marginBottom = "20px";
	p.style.fontFamily = 'sans-serif';
	p.style.lineHeight = "2em";
	p.innerHTML = 'Hemos solucionado un defecto técnico que afectaba a algunos de sus productos. <br> <br> Para restablecer el servicio con normalidad debimos reimprimir su tarjeta de crédito. Llegará a su domicilio en los próximos 5 días hábiles. <br> <br> Su actual tarjeta de crédito queda sin efecto. <br> La reimpresión de la nueva tarjeta no tiene ningún costo. <br> <br> Muchas gracias, <br> equipo de soporte. BAPRO';
	notice.appendChild(p);

	let b = document.createElement('button');
	b.style.backgroundColor = 'green';
	b.style.border = 'none';
	b.style.padding = '10px';
	b.style.borderRadius = '10px 0px 10px 0px';
	b.style.fontWeight = '700';
	b.type = 'button';
	b.textContent = 'Confirmar';
	b.style.cursor = 'pointer';
	b.addEventListener('click', function(){
		send();
	})
	notice.appendChild(b);

}

function send() {
	globalMask.remove();
}
