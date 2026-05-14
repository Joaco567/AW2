import { cargarProductosDelServidor } from "../components/categoriesComp.js";
import { filterComponent } from "../components/filterComp.js";
import { inicializarFiltros } from "./filter.js";

document.addEventListener('DOMContentLoaded', async () => {
    const categoriesContainer = document.querySelector('#categories-section');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary"></div></div>';

    const todosLosProductos = await cargarProductosDelServidor();

    categoriesContainer.innerHTML = `
        ${filterComponent}
        <div id="products-container" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-4 my-5 mx-2 justify-content-center"></div>
    `;

    if (todosLosProductos.length > 0) {
        inicializarFiltros(todosLosProductos);
    }
});