export const modalcanvaComponent = `<div class="modal fade" id="carritoModal" tabindex="-1" aria-labelledby="carritoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="carritoModalLabel">
                        <i class="bi bi-cart-check-fill text-success"></i> Producto/s agregados al carrito
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="listaCarrito" class="list-unstyled"></ul>
                    <hr>
                    <p class="fw-bold">Total: $<span id="totalCarrito">0</span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Seguir comprando</button>
                    <a href="#" id="btnIrCarrito" class="btn btn-success" onclick="irAlCarrito()">
                        <i class="bi bi-basket"></i> Ir al carrito
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="carritoOffcanvas" aria-labelledby="carritoOffcanvasLabel">
    <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title" id="carritoOffcanvasLabel">
            <i class="bi bi-basket-fill me-2"></i>Carrito de compras
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    
    <div class="offcanvas-body d-flex flex-column">
    <!-- Contenido que crece -->
        <div class="flex-grow-1">
        <!-- Lista de productos en el carrito -->
            <div id="carritoLista">
                <div class="alert alert-info text-center" role="alert">
                    <i class="bi bi-cart-x fs-1 d-block mb-2"></i>
                    Tu carrito está vacío
                </div>
            </div>

        <!-- Resumen del carrito -->
            <div id="carritoResumen" class="d-none">
            <!-- Productos se cargan aquí dinámicamente -->
            <div id="productosCarrito"></div>
                <hr>

            <!-- Subtotal y Total -->
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal (sin envío):</span>
                <span class="fw-bold">$<span id="subtotalCarrito">0</span></span>
            </div>

            <div class="alert alert-success py-2 mb-3" role="alert">
                <small>
                    <i class="bi bi-truck"></i> 
                    Envío gratis superando los $20.000
                </small>
            </div>

            <div class="d-flex justify-content-between mb-3 fs-5">
                <span class="fw-bold">Total:</span>
                <span class="fw-bold text-success">$<span id="totalCarritoOffcanvas">0</span></span>
            </div>

            <!-- Botones de acción (excepto vaciar carrito) -->
            <div class="d-grid gap-2">
                <button type="button" class="btn btn-success btn-lg" onclick="iniciarCompra()">
                    <i class="bi bi-credit-card-fill me-2"></i>Comprar
                </button>
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                    Seguir comprando
                </button>
            </div>
        </div>
    </div>

    <!-- Footer fijo con el botón de vaciar carrito -->
            <div class="mt-3 pt-3 border-top d-none" id="btnVaciarCarrito">
                <button type="button" class="btn btn-outline-danger w-100" onclick="vaciarCarrito()">
                <i class="bi bi-trash"></i> Vaciar carrito
            </button>
        </div>
    </div>
`

export function crearModalDatosPersonales(usuarioActual) {
    const modalViejo = document.getElementById("modalDatosPersonales");
    if (modalViejo) modalViejo.remove();

    const fechaObj = new Date(usuarioActual.fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opciones);

    const modalHTML = `
        <div class="modal fade" id="modalDatosPersonales" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title ms-auto">
                            <i class="bi bi-person-vcard-fill me-2"></i>Datos Personales
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                <i class="bi bi-person-fill me-2 text-primary"></i>Nombre:
                            </label>
                            <span>${usuarioActual.nombre}</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                <i class="bi bi-person-fill me-2 text-primary"></i>Apellido:
                            </label>
                            <span>${usuarioActual.apellido}</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                <i class="bi bi-envelope-fill me-2 text-success"></i>Correo:
                            </label>
                            <span>${usuarioActual.email}</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                <i class="bi bi-calendar-event-fill me-2 text-info"></i>Fecha de nacimiento:
                            </label>
                            <span>${fechaFormateada}</span>
                        </div>
                    </div>

                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalElement = document.getElementById("modalDatosPersonales");
    const modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener("hidden.bs.modal", () => {
        setTimeout(() => modalElement.remove(), 300);
    });

    modal.show();
}