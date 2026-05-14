import { footComponent } from "../components/footerComp.js"

const footContainer = document.querySelector('footer')

document.addEventListener('DOMContentLoaded', () => {
    if (footContainer) {
        footContainer.innerHTML = footComponent
    }
})