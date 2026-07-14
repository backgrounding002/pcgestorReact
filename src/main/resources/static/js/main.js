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
        // Si no hay user pero sí token, intentar decodificar (opcional)
        $('#userName').text('Usuario');
        $('#userRol').text('Administrador');
    }

    // Sidebar toggle
    $('#sidebarToggle').on('click', function() {
        $('#layoutSidenav_nav').toggleClass('show');
    });

    // Logout
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