function importCSS(urlRelativa, urlBase) {
  var urlAbsoluta = new URL(urlRelativa, urlBase);
  var elemento = document.createElement('link');
  elemento.rel = 'stylesheet';
  elemento.href = urlAbsoluta.href;
  document.head.appendChild(elemento);
}

export { importCSS }
