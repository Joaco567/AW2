export function inicializarToggleTema() {
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (!toggleBtn) return;
    
    const temaGuardado = localStorage.getItem('tema') || 'dark';
    aplicarTema(temaGuardado);
    
    toggleBtn.addEventListener('click', cambiarTema);
}

function aplicarTema(tema) {
    const body = document.body;
    
    if (tema === 'light') {
        body.setAttribute('data-bs-theme', 'light');
        actualizarIconoToggle('bi-moon-fill');
    } else {
        body.setAttribute('data-bs-theme', 'dark');
        actualizarIconoToggle('bi-sun-fill');
    }
    
    localStorage.setItem('tema', tema);
}

function cambiarTema() {
    const temaActual = document.body.getAttribute('data-bs-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevoTema);
}

function actualizarIconoToggle(iconClass) {
    const toggleIcon = document.querySelector('#theme-toggle i');
    if (toggleIcon) {
        toggleIcon.className = `bi ${iconClass}`;
    }
}