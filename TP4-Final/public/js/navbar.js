import { navbarComponent } from "../components/navbarComp.js";
import { crearModalDatosPersonales } from "../components/modalcanvaComp.js";
import { getSession } from "../utils/sessionStorage.controller.js";
import { inicializarToggleTema } from "./theme.js";

const navContainer = document.querySelector("header");

document.addEventListener("DOMContentLoaded", () => {
    if (navContainer) {
        navContainer.innerHTML = navbarComponent;

        document.getElementById("btnDatosPersonales")?.addEventListener("click", (e) => {
            e.preventDefault();
            const user = getSession();
            if (user) crearModalDatosPersonales(user);
        });

        document.getElementById("btnCerrarSesion")?.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.clear();
            localStorage.removeItem('usuarioLogeado');
            window.location.href = "./home.html";
        });

        inicializarToggleTema();
    }
});