class MenuSlide extends HTMLElement {
	constructor() {
		super();
	}
}

function closeMenu() {
    document.body.setAttribute('menu-state', 'close');
}
function showMenu() {
    document.body.setAttribute('menu-state', 'open');
}
function switchMenu() {
    if(document.body.getAttribute('menu-state') === 'close') {
        showMenu();
    }
    else {
        closeMenu();
    }
}
window.showMenu = showMenu;
window.closeMenu = closeMenu;
window.switchMenu = switchMenu;


customElements.define('menu-slide', MenuSlide);

export { MenuSlide }
