export const filterComponent = `
<!-- Panel de Filtros -->
<div class="container-fluid mt-5">
    <div class="card card-filter mb-5">
        <div class="card-header">
            <h5 class="mb-0">
                <i class="bi bi-funnel-fill me-2"></i>
                Filtros y Ordenamiento
            </h5>
        </div>
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <!-- Ordenar por -->
                <div class="col-md-3">
                    <label for="ordenProductos" class="form-label">
                        <i class="bi bi-sort-down me-1"></i>Ordenar por:
                    </label>
                    <select id="ordenProductos" class="form-select">
                        <option value="default">Por defecto</option>
                        <option value="categoria">Por categoria</option>
                        <option value="precio-asc">Precio: Menor a Mayor</option>
                        <option value="precio-desc">Precio: Mayor a Menor</option>
                        <option value="nombre-asc">Nombre: A-Z</option>
                        <option value="nombre-desc">Nombre: Z-A</option>
                    </select>
                </div>
                
                <!-- Precio mínimo -->
                <div class="col-md-3">
                    <label for="precioMin" class="form-label">
                        <i class="bi bi-cash me-1"></i>Precio mínimo: <span id="precioMinLabel">$0</span>
                    </label>
                    <input type="range" class="form-range" id="precioMin" min="0" max="500000" step="500" value="0">
                </div>
                
                <!-- Precio máximo -->
                <div class="col-md-3">
                    <label for="precioMax" class="form-label">
                        <i class="bi bi-cash-stack me-1"></i>Precio máximo: <span id="precioMaxLabel">$500.000</span>
                    </label>
                    <input type="range" class="form-range" id="precioMax" min="0" max="500000" step="1000" value="500000">
                </div>
                
                <!-- Botón reset -->
                <div class="col-md-3">
                    <button id="resetFiltros" class="btn btn-outline-warning w-100">
                        <i class="bi bi-arrow-clockwise me-1"></i>Restablecer
                    </button>
                </div>
            </div>
            
            <!-- Contador de resultados -->
            <div class="mt-3 text-center">
                <span id="contadorResultados" class="badge bg-info"></span>
            </div>
        </div>
    </div>
</div>
`