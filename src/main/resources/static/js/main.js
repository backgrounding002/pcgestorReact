// main.js - Funciones globales y control de sesión
$(document).ready(function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Verificar autenticación en páginas protegidas
    const loginPage = window.location.pathname.includes('login.html');
    if (!token && !loginPage) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar datos del usuario en la barra superior
    if (user.nombre) {
        $('#userName').text(user.nombre);
        $('#userRol').text(user.rol || 'Usuario');
    } else if (token) {
        $('#userName').text('Usuario');
        $('#userRol').text('Administrador');
    }

    // =========================================================
    // CONTROL DE ACCESO AL MENÚ LATERAL Y RUTAS SEGÚN ROL
    // =========================================================
    const rol = user.rol;

    // Función para ocultar el menú (oculta el enlace <a> y su contenedor si es necesario)
    const ocultarMenu = (idMenu) => {
        const menu = document.getElementById(idMenu);
        if (menu) {
            // Si está dentro de un <li> o un <div>, ocultamos el padre. Si no, ocultamos el enlace directo.
            menu.parentElement.style.display = 'none';
        }
    };

    if (rol === 'ROLE_USER') {
        // Usuarios normales no ven Usuarios ni Reportes
        ocultarMenu('menu-usuarios');
        ocultarMenu('menu-reportes');
    } else if (rol === 'ROLE_TECNICO') {
        // Técnicos no ven Usuarios (solo Admin)
        ocultarMenu('menu-usuarios');
        // Los técnicos SÍ ven Reportes, así que no se oculta.
    }

    // Proteger URLs directamente (por si escriben la ruta manualmente)
    const path = window.location.pathname;
    if (rol !== 'ROLE_ADMIN' && path.includes('usuarios.html')) {
        window.location.href = 'dashboard.html';
    }
    if (rol !== 'ROLE_ADMIN' && rol !== 'ROLE_TECNICO' && path.includes('reportes.html')) {
        window.location.href = 'dashboard.html';
    }

    // =========================================================
    // EVENTOS GENERALES (Sidebar y Logout)
    // =========================================================
    $('#sidebarToggle').on('click', function() {
        $('#layoutSidenav_nav').toggleClass('show');
    });

    $('#btnLogout').on('click', function() {
        Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    });
});

// Funciones auxiliares
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
}

function showSuccess(message) {
    Swal.fire('Éxito', message, 'success');
}

function showError(message) {
    Swal.fire('Error', message, 'error');
}

function showConfirm(message, callback) {
    Swal.fire({
        title: 'Confirmar',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed && callback) callback();
    });
}