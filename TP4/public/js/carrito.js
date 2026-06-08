import { getSession } from "../utils/sessionStorage.controller.js";

const obtenerStorage = () => {
    return getSession() ? localStorage : sessionStorage;
};

const obtenerClaveCarrito = () => {
    const user = getSession();
    return user ? `carrito_${user._id}` : 'carrito_invitado';
};

let carrito = JSON.parse(obtenerStorage().getItem(obtenerClaveCarrito())) || [];

function guardarCarrito() {
    obtenerStorage().setItem(obtenerClaveCarrito(), JSON.stringify(carrito));
}

// --- LÓGICA DE ACTUALIZACIÓN DE INTERFAZ (UI) ---

function actualizarCarritoUI() {
    renderizarModalExito();      
    renderizarCarritoOffcanvas();
}

function renderizarModalExito() {
    const lista = document.getElementById('listaCarrito');
    const totalElement = document.getElementById('totalCarrito');
    if (!lista || !totalElement) return;

    lista.innerHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i> ${item.nombre} x${item.cantidad}`;
        lista.appendChild(li);
        total += item.precio * item.cantidad;
    });
    
    totalElement.textContent = total.toLocaleString();
}

function renderizarCarritoOffcanvas() {
    const productosCarrito = document.getElementById('productosCarrito');
    const carritoVacio = document.querySelector('#carritoLista .alert');
    const carritoResumen = document.getElementById('carritoResumen');
    const btnVaciar = document.getElementById('btnVaciarCarrito');

    if (!productosCarrito) return;

    if (carrito.length === 0) {
        carritoVacio?.classList.remove('d-none');
        carritoResumen?.classList.add('d-none');
        btnVaciar?.classList.add('d-none');
        return;
    }

    carritoVacio?.classList.add('d-none');
    carritoResumen?.classList.remove('d-none');
    btnVaciar?.classList.remove('d-none');
    
    productosCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
          <div class="d-flex align-items-center w-100 gap-3 pt-2 mb-3 ${index > 0 ? 'border-top' : ''}">
            <img src="${item.imagen}" alt="${item.nombre}" class="rounded" style="width:70px; height:90px; object-fit:cover;">
            <div class="flex-grow-1">
              <h6 class="mb-1">${item.nombre}</h6>
              <span class="text-muted small">$${item.precio.toLocaleString()} c/u</span>
              <div class="d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span class="fw-bold">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
              </div>
            </div>
            <div class="text-end">
              <button class="btn btn-sm text-danger" onclick="eliminarDelCarrito(${index})">
                <i class="bi bi-trash"></i>
              </button>
              <div class="fw-bold">$${(item.precio * item.cantidad).toLocaleString()}</div>
            </div>
          </div>`;
        productosCarrito.appendChild(itemDiv);
        total += item.precio * item.cantidad;
    });

    document.getElementById('subtotalCarrito').textContent = total.toLocaleString();
    document.getElementById('totalCarritoOffcanvas').textContent = total.toLocaleString();
}

// --- FUNCIONES GLOBALES ---

function crearModalCompra() {
    const modalViejo = document.getElementById('modalCompraDinamico')
    if (modalViejo) modalViejo.remove()

    const modalHTML = `
    <div class="modal fade" id="modalCompraDinamico" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title text-success">
              <i class="bi bi-bag-heart-fill me-2"></i> ¡Gracias por tu compra!
            </h5>
            <button type="button" class="btn-close position-absolute end-0 top-0 m-3" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center pt-3">
            <p class="fs-5 mb-2">¡Tu compra fue realizada con éxito!</p>
            <p class="text-muted mb-1">Esperamos que disfrutes tus productos ❤️</p>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <a href="./home.html" class="btn btn-success px-4">Volver</a>
          </div>
        </div>
      </div>
    </div>
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHTML)
    
    const modalElement = document.getElementById('modalCompraDinamico')
    const modal = new bootstrap.Modal(modalElement)
    
    modalElement.addEventListener('hidden.bs.modal', () => {
        setTimeout(() => modalElement.remove(), 300)
    })
    
    modal.show()
}

window.agregarAlCarrito = function(nombre, id, precio, imagen) {
    const cantidadInput = document.getElementById(id);
    const cantidad = parseInt(cantidadInput?.value || 1);

    const itemExistente = carrito.find(item => item.id_producto === id);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ id_producto: id, nombre, precio, cantidad, imagen });
    }

    guardarCarrito();
    actualizarCarritoUI();
    if (cantidadInput) cantidadInput.value = 1;

    const modal = new bootstrap.Modal(document.getElementById('carritoModal'));
    modal.show();
};

window.cambiarCantidad = function(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarritoUI();
};

window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarritoUI();
};

window.vaciarCarrito = function() {
    if(confirm("¿Seguro que querés vaciar el carrito?")) {
        carrito = [];
        guardarCarrito();
        actualizarCarritoUI();
    }
};

window.iniciarCompra = async function() {
    const user = getSession();
    if (!user) {
        alert("Debés iniciar sesión para comprar.");
        window.location.href = "../pages/login.html";
        return;
    }

    const token = sessionStorage.getItem('token');

    const nuevaVenta = {
        id_usuario: user._id,
        total: carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0),
        address: user.direccion,
        
        products: carrito.map(item => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            precio: item.precio,
            nombre: item.nombre
        }))
    };

    try {
        const response = await fetch('http://localhost:5000/sale/checkoutmongo', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 👈 Mandarle el token al Backend de forma segura
            },
            body: JSON.stringify(nuevaVenta)
        });

        if (response.ok) {
            carrito = [];
            guardarCarrito();
            actualizarCarritoUI();
            bootstrap.Offcanvas.getInstance(document.getElementById('carritoOffcanvas'))?.hide();
            crearModalCompra();
        } else {
            const errorBackend = await response.json();
            alert(`Error del servidor: ${errorBackend}`);
            sessionStorage.clear();
            localStorage.removeItem('usuarioLogeado');
            window.location.href = "../pages/login.html";
        }
    } catch (e) { 
        alert("Error de conexión");
        console.log(e);
    }
};

window.irAlCarrito = () => {
    const modalElement = document.getElementById('carritoModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    
    if (modalInstance) {
        modalInstance.hide();
    }

    setTimeout(() => {
        const offcanvasElement = document.getElementById('carritoOffcanvas');
        const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
        offcanvasInstance.show();
    }, 400);
};

// --- INICIALIZACIÓN ---
function inicializarCarrito() {
    const contenedorCarrito = document.getElementById('productosCarrito');
    
    if (contenedorCarrito) {
        actualizarCarritoUI();
    } else {
        setTimeout(inicializarCarrito, 100);
    }
}

inicializarCarrito();