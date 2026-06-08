import { addSession } from "../utils/sessionStorage.controller.js";

const migrarCarritoInvitado = (userId) => {
    const carritoInvitado = JSON.parse(sessionStorage.getItem('carrito_invitado')) || [];
    
    if (carritoInvitado.length === 0) return;

    const claveUser = `carrito_${userId}`;
    let carritoUsuario = JSON.parse(localStorage.getItem(claveUser)) || [];

    carritoInvitado.forEach(itemInvitado => {
        const itemExistente = carritoUsuario.find(u => u.id_producto === itemInvitado.id_producto);
        
        if (itemExistente) {
            itemExistente.cantidad += itemInvitado.cantidad;
        } else {
            carritoUsuario.push(itemInvitado);
        }
    });

    localStorage.setItem(claveUser, JSON.stringify(carritoUsuario));
    sessionStorage.removeItem('carrito_invitado');
};

// --- FUNCIÓN DE LOGIN ---
const auth = async ({ email, pass }) => {
    try {
        const response = await fetch(`http://localhost:5000/user/loginmongo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "contrasena": pass })
        });

        if (!response.ok) {
            const errorMsg = await response.json();
            throw new Error(errorMsg || 'Error en las credenciales');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en auth:', error);
        alert(error.message);
        return null;
    }
};

// --- EVENTO FORMULARIO LOGIN ---
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('txtEmail').value;
        const password = document.getElementById('txtPassword').value;

        if (email && password) {
            const dataBackend = await auth({ email, pass: password });
            
            if (dataBackend && dataBackend.usuario) {
                const { usuario, token } = dataBackend

                sessionStorage.setItem('token', token)
                addSession(usuario);
                localStorage.setItem('usuarioLogeado', JSON.stringify(usuario));

                migrarCarritoInvitado(usuario._id);

                alert(`¡Bienvenido de nuevo, ${usuario.nombre}!`);

                window.location.replace('./home.html');
            }
        }
    });
}

// --- FUNCIÓN DE REGISTRO ---
export const registrarUsuario = async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
        nombre: document.getElementById('txtNombre').value,
        apellido: document.getElementById('txtApellido').value,
        email: document.getElementById('txtEmail').value,
        contrasena: document.getElementById('txtPassword').value,
        fecha: document.getElementById('txtFecha').value,
        direccion: document.getElementById('txtDireccion').value
    };

    try {
        const response = await fetch('http://localhost:5000/user/registermongo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        });

        const dataBackend = await response.json();

        if (response.ok) {
            const { usuario, token } = dataBackend;

            sessionStorage.setItem('token', token);
            addSession(usuario || dataBackend); 
            localStorage.setItem('usuarioLogeado', JSON.stringify(usuario || dataBackend));

            migrarCarritoInvitado(usuario ? usuario._id : dataBackend._id);

            alert('¡Cuenta creada con éxito! Ahora podés navegar cómodo!');

            window.location.replace('./home.html');
        } else {
            alert(data || 'Hubo un error en el registro');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        alert('No se pudo conectar con el servidor.');
    }
};