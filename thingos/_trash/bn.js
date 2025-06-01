
setInterval(function(){
	let trs = document.querySelectorAll('tr');
	for(var inx = 0; inx < trs.length; inx++) {

		if(/10512.5/.test(trs[inx].innerHTML)) {
			let row = document.createElement('tr');
			row.innerHTML = '<td title="" style="text-align: center;">Titular</td><td title="" style="text-align: center;">06/12/2022</td><td title="" style="text-align: center;">07/12/2022</td><td title="" style="text-align: center;">MERCADOPAGO *WORKOS</td><td title="" style="text-align: center;"></td><td title="" style="text-align: center;">-30000</td><td title="" style="text-align: center;">0.00</td>';
			trs[inx].after(row);
		}

		// Consumo del mes
		replaceText(trs[inx], '52635.57', '10169.19');

		// Subtotal
		replaceText(trs[inx], '103031.46', '6.369,61');

		//Total
		replaceText(trs[inx], '107395.58', '30.565');



		if(/WORKOS/.test(trs[inx].innerHTML)) {
			trs[inx].remove();
		}

		document.body.innerHTML = 'Hola mundo! 2';


	}

	//resumenPie
	replaceText(document.getElementById('resumenPie'), '107395.58', '30.565');

	//datosTarjeta-izquierda
	replaceText(document.getElementById('datosTarjeta-izquierda'), '107395.58', '30.565');

},1000)
//49.191,19

function replaceText(element, sourceText, targetText) {
	let rx = new RegExp(sourceText);
	replaceRX(element, rx, sourceText, targetText);
}

function replaceRX(element, rx, sourceText, targetText) {
	if(rx.test(element.innerHTML)) {
		element.innerHTML = element.innerHTML.replace(sourceText, targetText)
	}
}
