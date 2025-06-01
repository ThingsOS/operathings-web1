const Types = [
    {
        key: 'stores',
        title: 'Tienda minorista',
        icon: 'store'
    },
    {
        key: 'resto',
        title: 'Casa de comida',
        icon: 'restaurant_menu'
    }
]

window.addEventListener('load', function(){
    let bf = document.querySelector('.type-filter-buttons');
    for(let inx = 0; inx < Types.length; inx++) {

        let type = Types[inx];
        let b = document.createElement('button');

        let icon = document.createElement('icon');
        icon.textContent = type.icon;
        b.appendChild(icon);

        let title = document.createElement('small');
        title.textContent = type.title;
        b.appendChild(title);

        b.addEventListener('click', function(){
            window.filterByType(type.key);
        });

        bf.appendChild(b);

    }
});

window.filterBySize = function(size) {

}
window.filterByType = function(type) {

}
