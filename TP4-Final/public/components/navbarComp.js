import { getSession } from "../utils/sessionStorage.controller.js";

const user = getSession();

let nombreUsuario = "Usuario";
let botonSesionHTML = "";

if (user) {
    nombreUsuario = `${user.apellido}, ${user.nombre}`;
    botonSesionHTML = `
    <div class="dropdown my-2">
      <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownUsuario" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-2"></i>${nombreUsuario}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="#" id="btnDatosPersonales">
            <i class="bi bi-person-vcard me-2"></i>Mis Datos
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item text-danger" href="#" id="btnCerrarSesion">
            <i class="bi bi-box-arrow-left me-2"></i>Salir
          </a>
        </li>
      </ul>
    </div>`;
} else {
    botonSesionHTML = `
    <div class="d-flex gap-2">
        <a href="./login.html" class="btn btn-outline-primary">Iniciar Sesión</a>
        <a href="./signup.html" class="btn btn-outline-success">Registrarse</a>
    </div>`;
}

export const navbarComponent = `
<nav class="navbar navbar-expand-lg bg-body-secondary shadow-sm">
  <div class="container-fluid my-2">
    <a href="./home.html" class="navbar-brand">
       <span class="fw-bold">Home</span>
    </a>

    <div class="d-flex align-items-center gap-3 ms-auto">
        <button id="theme-toggle" class="btn btn-outline-secondary" title="Tema">
            <i class="bi bi-sun-fill"></i> Tema
        </button>

        <button class="btn btn-outline-info" data-bs-toggle="offcanvas" data-bs-target="#carritoOffcanvas">
            <i class="bi bi-basket"></i> Carrito
        </button>

        ${botonSesionHTML}
    </div>
  </div>
</nav>
`;