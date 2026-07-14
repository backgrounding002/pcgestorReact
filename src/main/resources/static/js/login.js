// login.js - Mostrar/ocultar contraseña y autenticación con backend Spring Boot

document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar contraseña
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Login al backend Spring Boot
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            Swal.fire('Campos incompletos', 'Por favor ingrese usuario y contraseña', 'warning');
            return;
        }

        try {
            const response = await fetch('/pcgestor/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ nombre: username, rol: 'Administrador' }));
                window.location.href = 'index.html';
            } else {
                Swal.fire('Error', data.message || 'Credenciales incorrectas', 'error');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            Swal.fire('Error de conexión', 'No se pudo conectar con el servidor', 'error');
        }
    });

    // Enlaces (funcionalidad pendiente)
    const btnRegistro = document.getElementById('btnRegistro');
    const btnRecuperar = document.getElementById('btnRecuperar');

    if (btnRegistro) {
        btnRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire('Registro', 'Funcionalidad en desarrollo', 'info');
        });
    }

    if (btnRecuperar) {
        btnRecuperar.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire('Recuperar contraseña', 'Funcionalidad en desarrollo', 'info');
        });
    }
});