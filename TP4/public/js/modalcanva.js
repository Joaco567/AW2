import { modalcanvaComponent } from "../components/modalcanvaComp.js"

let modalcanvaContainer = document.querySelector('.carrito')

window.modalesListos = false

window.addEventListener('load', () => {
    if (modalcanvaContainer) {
        
        modalcanvaContainer.innerHTML = modalcanvaComponent
        
        window.modalesListos = true
        window.dispatchEvent(new Event('modalesInsertados'))
        
        if (typeof window.inicializarBotonIrCarrito === 'function') {
            window.inicializarBotonIrCarrito()
        }
    }
})