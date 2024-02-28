const productsURL = 'products.json';

let carrito = [];
let total = 0;
let productos = [];

// Solicitar edad
function solicitarEdad() {
    Swal.fire({
        title: 'Ingrese su edad',
        input: 'number',
        inputAttributes: { min: 1 },
        showCancelButton: false,
        confirmButtonText: 'Continuar',
        showLoaderOnConfirm: true,
        customClass: {
            popup: 'estiloEdad'
        },
        preConfirm: (edad) => {
            if (edad < 18) {
                Swal.showValidationMessage('Debes ser mayor de 18 años para poder ingresar al sitio');
                return false;
            }
            return true;
        }
    }).then((result) => {
        if (result.value) {
            cargarProductos();
        } else {
            solicitarEdad();
        }
    });
}

window.addEventListener('load', solicitarEdad);

// Cargar productos
async function cargarProductos() {
    try {
        const respuesta = await fetch(productsURL);
        productos = await respuesta.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Mostrar productos
function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('productos');
    contenedorProductos.innerHTML = '';
    productos.forEach(producto => {
        const imagen = `./images/${producto.imagen}`;
        const productoHTML = `
            <div class="producto">
                <h3>${producto.nombre}</h3>
                <img src="${imagen}" alt="${producto.nombre}">
                <p>Precio: $${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
        contenedorProductos.innerHTML += productoHTML;
    });
}

// LocalStorage
window.addEventListener('load', () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        calcularTotal();
    }
});

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(producto => producto.id === idProducto);
    carrito.push(producto);
    calcularTotal();
    guardarCarrito();
}

// Calcular el total de la compra
function calcularTotal() {
    total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    const totalElemento = document.getElementById('total');
    totalElemento.textContent = `Total: $${total}`;
}

// Vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    total = 0;
    const totalElemento = document.getElementById('total');
    totalElemento.textContent = `Total: $${total}`;
    localStorage.removeItem('carrito');
}

document.getElementById('vaciarBtn').addEventListener('click', vaciarCarrito);

// Finalizar la compra
function comprar() {
    if (carrito.length > 0) {
        Swal.fire({
            title: "¡Compra realizada con éxito!",
            text: `El total de su compra es de: $${total}`,
            icon: "success"
        });
        vaciarCarrito();
    } else {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "El carrito está vacío, agrega productos antes de realizar la compra.",
        });
    }
}

const comprarBtn = document.getElementById('comprarBtn');
comprarBtn.addEventListener('click', comprar);

cargarProductos();
