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
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor ingrese usuario y contraseña',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Mostrar loading
        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch('/pcgestor/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            // Verificar si la respuesta tiene contenido JSON
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');

            let data = null;

            if (isJson) {
                try {
                    data = await response.json();
                } catch (parseError) {
                    console.error('Error al parsear JSON:', parseError);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del servidor',
                        text: 'El servidor devolvió una respuesta inválida. Por favor intente más tarde.',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Reintentar'
                    });
                    return;
                }
            } else {
                // Si no es JSON, leer como texto para depuración
                const text = await response.text();
                console.error('Respuesta no JSON:', text);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de formato',
                    text: 'El servidor devolvió una respuesta inesperada. Contacte al administrador.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Reintentar'
                });
                return;
            }

            // Cerrar loading
            Swal.close();

            if (response.ok && data && data.token) {
                // Guardar datos en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    nombre: username,
                    rol: data.rol || 'Administrador'
                }));

                // Mensaje de éxito
                await Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso. Redirigiendo al dashboard...',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                // Redirigir a dashboard.html (antes iba a index.html)
                window.location.href = 'dashboard.html';
            } else {
                // Credenciales incorrectas u otro error
                let mensajeError = 'Credenciales incorrectas. Por favor verifique su usuario y contraseña.';

                if (data && data.message) {
                    const msg = data.message.toLowerCase();
                    if (msg.includes('usuario') || msg.includes('user')) {
                        mensajeError = 'El usuario ingresado no existe.';
                    } else if (msg.includes('contraseña') || msg.includes('password')) {
                        mensajeError = 'La contraseña ingresada es incorrecta.';
                    } else {
                        mensajeError = data.message;
                    }
                } else if (data && data.error) {
                    mensajeError = data.error;
                } else if (response.status === 401) {
                    mensajeError = 'Credenciales incorrectas. Por favor verifique su usuario y contraseña.';
                } else if (response.status === 404) {
                    mensajeError = 'El usuario no existe. Por favor regístrese.';
                } else if (response.status === 403) {
                    mensajeError = 'No tiene permisos para acceder al sistema.';
                } else if (response.status === 500) {
                    mensajeError = 'Error interno del servidor. Por favor intente más tarde.';
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error de autenticación',
                    text: mensajeError,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        } catch (error) {
            // Cerrar loading
            Swal.close();

            console.error('Error de conexión:', error);

            let mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            if (error.message) {
                if (error.message.includes('Failed to fetch')) {
                    mensajeError = 'No se pudo conectar con el servidor. Verifique que el servidor esté corriendo y sea accesible.';
                } else if (error.message.includes('Unexpected end of JSON input')) {
                    mensajeError = 'El servidor devolvió una respuesta incompleta. Por favor intente más tarde.';
                } else {
                    mensajeError = error.message;
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: mensajeError,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Reintentar'
            });
        }
    });

    // Enlaces (funcionalidad pendiente)
    const btnRegistro = document.getElementById('btnRegistro');
    const btnRecuperar = document.getElementById('btnRecuperar');

    if (btnRegistro) {
        btnRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                icon: 'info',
                title: 'Registro',
                text: 'Funcionalidad en desarrollo',
                confirmButtonText: 'Entendido'
            });
        });
    }

    if (btnRecuperar) {
        btnRecuperar.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                icon: 'info',
                title: 'Recuperar contraseña',
                text: 'Funcionalidad en desarrollo',
                confirmButtonText: 'Entendido'
            });
        });
    }
});