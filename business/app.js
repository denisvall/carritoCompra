const products = document.getElementById('products');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templatecarrito = document.getElementById('template-carrito').content;
const templatefooter = document.getElementById('template-footer').content;

const fragment = document.createDocumentFragment();

let carrito = {};

// console.log(products, templateCard);

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    // Validar si el carrito de compra está almacenado en el localStorage
    if (localStorage.getItem('carritoProducto')) {

        //Recuperamos el objeto
        carrito = JSON.parse(localStorage.getItem('carritoProducto'));

        // pintar el carrito
        drawCar();
    }
});

// Asiganr el evento para agregar carritos al boton de comprar
products.addEventListener('click', e => {
    addCar(e);
});

items.addEventListener('click', e => {
    btnAcciones(e);
})

// Obtener los datos a pintar
const fetchData = async() => {
    try {
        const res = await fetch('./data/data.json');
        const data = await res.json();

        // Pintar las cards de productos
        drawProducts(data);
    } catch (error) {
        console.log(error);
    }
}

const drawProducts = (data) => {

    // Recorrer los elementos para pintar las cards
    data.forEach(element => {
        templateCard.querySelector('h5').textContent = element.title;
        templateCard.querySelector('p span').textContent = element.precio;
        templateCard.querySelector('img').setAttribute('src', element.thumbnailUrl);
        templateCard.querySelector('img').setAttribute('alt', element.title);
        templateCard.querySelector('.btnComprar').dataset.id = element.id;
        // templateCard.querySelector('.btnComprar').setAttribute('id', element.id);

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);

    });
    products.appendChild(fragment);

    // console.log(data);
}

const addCar = e => {

    // console.log(e.target);
    // console.log(e.target.classList.contains('btnComprar'));

    // Validar el elemento html que queremos capturar el evento
    if (e.target.classList.contains('btnComprar')) {

        // capturar el elmentos que contiene el producto
        let obj = e.target.parentElement

        // Asignar el objeto al tabla del carrito
        setCar(obj);
    }

    // Detener la propagación de eventos a todo el contenedor
    e.stopPropagation();
}

const setCar = obj => {

    // console.log(obj)
    // crear objeto de producto
    const product = {
        id: obj.querySelector('.btnComprar').dataset.id,
        nombre: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p span').textContent,
        cantidad: 1
    }

    // Si ya existe sumar
    if (carrito.hasOwnProperty(product.id)) {
        product.cantidad = carrito[product.id].cantidad + 1;
    }

    // Asiganr el objeto producto al array del carrito
    carrito[product.id] = {...product };

    // pintar el carrito
    drawCar();

}

const drawCar = () => {
    // console.log(carrito);

    items.innerHTML = '';

    // Recorrer el array de objetos para pintar el carrito
    Object.values(carrito).forEach(item => {
        templatecarrito.querySelector('th').textContent = item.id;
        templatecarrito.querySelectorAll('td')[0].textContent = item.nombre;
        templatecarrito.querySelectorAll('td')[1].textContent = item.cantidad;
        templatecarrito.querySelector('.btnMas').dataset.id = item.id;
        templatecarrito.querySelector('.btnMenos').dataset.id = item.id;
        templatecarrito.querySelectorAll('td span')[0].textContent = item.cantidad * item.precio;

        const clon = templatecarrito.cloneNode(true);
        fragment.appendChild(clon);
    });

    // console.log(items);
    items.appendChild(fragment);

    // pintar el footer
    drawFooter();

    //Almacenar el localStoarage
    localStorage.setItem('carritoProducto', JSON.stringify(carrito));
}

const drawFooter = () => {

    footer.innerHTML = '';

    //Validar si el objeto carrito está vacío
    if (Object.keys(carrito).length == 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito Vacío - Agrue Productos al Carrito!</th>'

        return;
    }

    // Obtener los totales
    const TotalProducto = Object.values(carrito).reduce((acumula, { cantidad }) => acumula + cantidad, 0);
    const TotalPagar = Object.values(carrito).reduce((acumula, { cantidad, precio }) => acumula + (cantidad * precio), 0);

    // Asignar los totales a los tags
    templatefooter.querySelectorAll('td')[0].textContent = TotalProducto;
    templatefooter.querySelectorAll('td span')[0].textContent = TotalPagar;

    const clonfooter = templatefooter.cloneNode(true);
    fragment.appendChild(clonfooter);

    footer.appendChild(fragment);

    // Asignar la funcionalidad de limpiar carrito
    const vaciarBtn = document.getElementById('btnVaciarTodo');
    vaciarBtn.addEventListener('click', () => {

        // Vaciar el objeto
        carrito = {};

        // Llamada a pintar carrito para que limpie la tabla
        drawCar();
    })
}

const btnAcciones = e => {

    // console.log(e.target);
    // Validar el elemento html que queremos capturar el evento, para la acción de aumentar
    if (e.target.classList.contains('btnMas')) {
        // if (e.target.getElementsByClassName('btnMas')) {

        // console.log(carrito[e.target.dataset.id]);
        const rowProduct = carrito[e.target.dataset.id];

        rowProduct.cantidad++;
        carrito[e.target.dataset.id] = {...rowProduct };

        // llamar a pintar carrito para actualizar el dato
        drawCar()
    }

    // Validar el elemento html que queremos capturar el evento, para la acción de aumentar
    if (e.target.classList.contains('btnMenos')) {
        // if (e.target.getElementsByClassName('btnMas')) {

        // console.log(carrito[e.target.dataset.id]);
        const rowProduct = carrito[e.target.dataset.id];

        rowProduct.cantidad--;

        // Si la cantidad llega a 0 eliminamos el producto del carrito
        if (rowProduct.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        // carrito[e.target.dataset.id] = {...rowProduct };

        // llamar a pintar carrito para actualizar el dato
        drawCar()
    }

    // Detener la propagación de eventos a todo el contenedor
    e.stopPropagation();
}