export async function cargarProductosDelServidor() {
    try {
        const response = await fetch('http://localhost:5000/product/allmongo');
        if (!response.ok) throw new Error('Error al conectar con la API');
        return await response.json();
    } catch (error) {
        console.error("Error cargando productos:", error);
        return [];
    }
}

export async function generarProductos(productosFiltrados) {
    if (!productosFiltrados || productosFiltrados.length === 0) {
        return '<p class="text-center text-muted my-5">No se encontraron productos.</p>';
    }

    return `
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-4 my-5 mx-2 justify-content-center">
        ${productosFiltrados.map(producto => `
            <div class="col">
                <div class="card card-product h-100">
                    <img src="${producto.image}" class="card-img-top p-3" alt="${producto.name}" style="height: 250px; object-fit: contain;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-center fw-bold">${producto.name}</h5>
                        <p class="card-text lh-base text-center small">${producto.desc}</p>
                        
                        <div class="mt-auto">
                            <div class="row g-2 align-items-center mb-3">
                                <div class="col-7">
                                    <p class="price fw-bold m-0">$${producto.price.toLocaleString()}</p>
                                </div>
                                <div class="col-5">
                                    <input type="number" id="${producto._id}" class="form-control form-control-sm text-center" min="1" value="1">
                                </div>
                            </div>

                            <div class="text-center">
                                <button type="button" class="btn btn-outline-success w-100" 
                                        onclick="agregarAlCarrito('${producto.nombre.replace(/'/g, "\\'")}', '${producto._id}', ${producto.precio}, '${producto.imagen}')">
                                    <i class="bi bi-cart-plus"></i> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
}