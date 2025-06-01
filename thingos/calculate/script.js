import { implementEventInterface } from "https://fw.workos.app/scripts/interfaces/events/index.js";

class BudgetEditor extends HTMLElement {
    constructor(config) {
        super();
        implementEventInterface(this);

        let tit = document.createElement('div');
        tit.className = 'be-title';
        tit.textContent = 'Calculadora de presupuesto';
        this.appendChild(tit);

        this.ul = document.createElement('ul');
        this.appendChild(this.ul);
        this.loadData(config.data);

        let totalRow = document.createElement('div');
        totalRow.className = 'be-total-row';
        this.appendChild(totalRow);

        let totalSpan = document.createElement('span');
        totalRow.appendChild(totalSpan);
        totalSpan.textContent = 0;
        this.totalSpan = totalSpan;

        let totalSmall = document.createElement('small');
        totalSmall.textContent = 'Por mes';
        totalRow.appendChild(totalSmall);

        this.updateTotal();

    }
    loadData(data) {
        this.ul.innerHTML = '';
        for(var inx = 0; inx < data.length; inx++) {

            let d = data[inx];

            let li = document.createElement('li');
            li.data = d;
            this.ul.appendChild(li);

            // Cabecera
            let init = document.createElement('div');
            init.className = 'concept-init';
            li.appendChild(init);

            let head = document.createElement('div');
            head.className = 'concept-head';
            init.appendChild(head);

            let title = document.createElement('h4');
            title.innerHTML = d.title;
            head.appendChild(title);

            let descript = document.createElement('p');
            descript.innerHTML = d.descript;
            head.appendChild(descript);

            if(d.unitPrice) {
                let units = document.createElement('div');
                units.className = 'budge-units-price';

                let price = document.createElement('span');
                price.className = 'budge-units-price-value';
                price.innerHTML = d.unitPrice;
                units.appendChild(price);

                if(d.unitType) {
                    let type = document.createElement('span');
                    type.className = 'budge-units-price-type';
                    type.innerHTML = `por ${d.unitType}`;
                    units.appendChild(type);
                }

                console.log(d.rewardedUnits);
                if(d.rewardedUnits) {
                    let small = document.createElement('small');
                    small.textContent = `${d.rewardedUnits} bonificados`;
                    small.className = 'budge-rewarded';
                    units.appendChild(small);
                }

                init.appendChild(units);
            }

            // Unidades
            let unitsInsert = document.createElement('div');
            unitsInsert.className = 'units-insert';
            li.appendChild(unitsInsert);

            let input = document.createElement('input');
            li.input = input;
            input.addEventListener('input', function(){
                this.updateTotal();
            }.bind(this));
            if(d.units) {
                input.value = d.units;
                li.ammount = d.units
            };
            unitsInsert.appendChild(input);

            if(!d.units) {
                input.disabled = true;
            }

            if(d.unitsLabel) {
                let small = document.createElement('small');
                small.textContent = d.unitsLabel[1];
                unitsInsert.appendChild(small);
            }

            // Total
            li.value = 0;

            let total = document.createElement('div');
            total.className = 'concept-total';
            li.appendChild(total);

            let st = document.createElement('span');
            st.textContent = 0;
            li.total = st;
            total.appendChild(st);

        }
    }
    updateTotal() {
        let lis = this.ul.querySelectorAll('li');
        let total = 0;
        for(var inx = 0; inx < lis.length; inx++) {
            let l = lis[inx];

            // Obtenemos cantidad
            var p = parseInt(l.input.value);
            if(isNaN(p)) { p = 1 };

            if(l.data.rewardedUnits) {
                p -= l.data.rewardedUnits;
            }

            if(p < 0) { p = 0 };

            // Obtenemos total de concepto
            let t = l.data.unitPrice * p;

            // Actualizamos el total en el elemento
            l.total.textContent = new Intl.NumberFormat('es-ar').format(t);
            total += t;
        }
        this.totalSpan.textContent = new Intl.NumberFormat('es-ar').format(total);
        this.launchEvent('update-total', total);
    }
}

customElements.define('budget-editor', BudgetEditor);

export { BudgetEditor }
