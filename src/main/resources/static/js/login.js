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
<<<<<<< HEAD
                    rol: data.rol || 'Administrador'
=======
                    rol: data.rol // CAMBIO: Se guarda el rol exacto de la BD (ej. ROLE_ADMIN)
>>>>>>> dc4bf93 (feat: implementacion de modulos de seguridad y recuperacion)
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

<<<<<<< HEAD
                // Redirigir a dashboard.html (antes iba a index.html)
=======
                // Redirigir a dashboard.html
>>>>>>> dc4bf93 (feat: implementacion de modulos de seguridad y recuperacion)
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

    // =========================================================
    // NUEVA LÓGICA: Registro y Recuperación de Contraseña
    // =========================================================
    const btnRegistro = document.getElementById('btnRegistro');
    const btnRecuperar = document.getElementById('btnRecuperar');

    // 1. Funcionalidad de Registro
    if (btnRegistro) {
        btnRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            
            Swal.fire({
                title: 'Registro de Usuario',
                html: `
                    <input id="reg-user" class="swal2-input" placeholder="Nombre de usuario">
                    <input id="reg-pass" type="password" class="swal2-input" placeholder="Contraseña">
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Registrarse',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                preConfirm: () => {
                    const user = document.getElementById('reg-user').value;
                    const pass = document.getElementById('reg-pass').value;
                    if (!user || !pass) {
                        Swal.showValidationMessage('Llena todos los campos');
                    }
                    return { username: user, password: pass };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/pcgestor/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(result.value)
                    })
                    .then(res => {
                        if (res.status === 201 || res.status === 200) {
                            Swal.fire('¡Bienvenido!', 'Usuario registrado exitosamente. Ya puedes iniciar sesión.', 'success');
                        } else {
                            return res.json().then(data => {
                                throw new Error(data.error || 'El usuario ya existe o los datos son inválidos.');
                            });
                        }
                    })
                    .catch(err => Swal.fire('Error', err.message, 'error'));
                }
            });
        });
    }

    // 2. Funcionalidad de Recuperación de Contraseña
    if (btnRecuperar) {
        btnRecuperar.addEventListener('click', (e) => {
            e.preventDefault();
            
            Swal.fire({
                title: 'Recuperar Contraseña',
                input: 'text',
                inputLabel: 'Ingresa tu nombre de usuario',
                inputPlaceholder: 'Ej: admin',
                showCancelButton: true,
                confirmButtonText: 'Generar Token',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                inputValidator: (value) => {
                    if (!value) return '¡Debes escribir tu usuario!';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/pcgestor/api/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: result.value })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            Swal.fire('Error', data.error, 'error');
                        } else {
                            Swal.fire({
                                title: '¡Token Generado!',
                                html: `<p>Se ha generado un token de recuperación.</p>
                                       <p><b>Copia este token:</b></p>
                                       <code style="background:#f4f4f4; padding:8px; border-radius:5px; font-size:14px; display:block; margin-top:10px;">${data.token_simulado}</code>`,
                                icon: 'success',
                                confirmButtonText: 'Ir a cambiar contraseña',
                                confirmButtonColor: '#3085d6'
                            }).then(() => {
                                mostrarModalReset();
                            });
                        }
                    })
                    .catch(err => Swal.fire('Error', 'Error de conexión con el servidor', 'error'));
                }
            });
        });
    }

    // Función interna para el segundo modal de recuperación
    function mostrarModalReset() {
        Swal.fire({
            title: 'Nueva Contraseña',
            html: `
                <input id="swal-token" class="swal2-input" placeholder="Pega el Token aquí" style="margin-bottom: 10px;">
                <input id="swal-pass" type="password" class="swal2-input" placeholder="Nueva Contraseña">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Cambiar Contraseña',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            preConfirm: () => {
                const token = document.getElementById('swal-token').value;
                const pass = document.getElementById('swal-pass').value;
                if (!token || !pass) {
                    Swal.showValidationMessage('Ambos campos son obligatorios');
                }
                return { token: token, nuevaPassword: pass };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/pcgestor/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        Swal.fire('Error', data.error, 'error');
                    } else {
                        Swal.fire('Éxito', data.mensaje, 'success');
                    }
                })
                .catch(err => Swal.fire('Error', 'Error al conectar con el servidor', 'error'));
            }
        });
    }
});