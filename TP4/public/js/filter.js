let productosFiltrados = [];
let productosOriginales = [];

export function inicializarFiltros(productos) {
    productosOriginales = [...productos];
    productosFiltrados = [...productos];

    renderizarProductos();
    
    setTimeout(() => {
        configurarEventosFiltros();
        actualizarContador();
    }, 100);
}

function configurarEventosFiltros() {
    const selectOrden = document.getElementById('ordenProductos');
    if (selectOrden) {
        selectOrden.addEventListener('change', (e) => {
            ordenarProductos(e.target.value);
        });
    }
    
    const rangoMin = document.getElementById('precioMin');
    const rangoMax = document.getElementById('precioMax');
    
    if (rangoMin && rangoMax) {
        rangoMin.addEventListener('input', actualizarFiltroPrecios);
        rangoMax.addEventListener('input', actualizarFiltroPrecios);
    }
    
    document.getElementById('resetFiltros')?.addEventListener('click', resetearFiltros);
}

function ordenarProductos(criterio) {
    switch (criterio) {
        case 'categoria':
            productosFiltrados.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'precio-asc':
            productosFiltrados.sort((a, b) => a.price - b.price);
            break;
        case 'precio-desc':
            productosFiltrados.sort((a, b) => b.price - a.price);
            break;
        case 'nombre-asc':
            productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nombre-desc':
            productosFiltrados.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            productosFiltrados = [...productosOriginales];
    }
    renderizarProductos();
}

function actualizarFiltroPrecios() {
    const min = parseInt(document.getElementById('precioMin').value) || 0;
    const max = parseInt(document.getElementById('precioMax').value) || 999999;
    
    document.getElementById('precioMinLabel').textContent = `$${min.toLocaleString()}`;
    document.getElementById('precioMaxLabel').textContent = `$${max.toLocaleString()}`;
    
    productosFiltrados = productosOriginales.filter(p => 
        p.price >= min && p.price <= max
    );
    
    renderizarProductos();
}

function resetearFiltros() {
    productosFiltrados = [...productosOriginales];
    document.getElementById('ordenProductos').value = 'default';
    document.getElementById('precioMin').value = 0;
    document.getElementById('precioMax').value = 500000;
    document.getElementById('precioMinLabel').textContent = '$0';
    document.getElementById('precioMaxLabel').textContent = '$500.000';
    renderizarProductos();
}

function renderizarProductos() {
    const container = document.querySelector('#products-container')
    if (!container) return
    
    container.innerHTML = productosFiltrados.map((producto) => `
    <div class="col">
        <div class="card card-product h-100 mt-3">
            <img src="${producto.image}" class="card-img-top p-3" alt="${producto.name}" style="height: 250px; object-fit: contain;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-center fw-bold">${producto.name}</h5>
                <p class="card-text text-center small">${producto.desc}</p>
                <div class="mt-auto">
                    <div class="row g-2 align-items-center mb-3">
                        <div class="col-7">
                            <p class="price fw-bold m-0">$${producto.price.toLocaleString()}</p>
                        </div>
                        <div class="col-5">
                            <input type="number" id="${producto._id}" class="form-control form-control-sm text-center m-0" min="1" value="1">
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="button" class="btn btn-outline-success w-100"
                        onclick="agregarAlCarrito('${producto.name.replace(/'/g, "\\'")}', '${producto._id}', ${producto.price}, '${producto.image}')">
                            <i class="bi bi-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `).join('')
    
    actualizarContador()
}

function actualizarContador() {
    const contador = document.getElementById('contadorResultados');
    if (contador) {
        contador.textContent = `${productosFiltrados.length} productos encontrados`;
    }
}