import { getSession } from "../utils/sessionStorage.controller.js";

const user = getSession();
const txtSaludo = document.getElementById('txtSaludo');

if (user && user.nombre) {
    txtSaludo.textContent = `Hola ${user.nombre} ${user.apellido}! Qué deseas comprar hoy? 🤔`;
} else {
    txtSaludo.textContent = `Mucho gusto verte por aquí! No olvides logearte para poder realizar tu compra 😉`;
}