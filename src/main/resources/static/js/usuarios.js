// usuarios.js - Gestión de usuarios con API real

let usuariosTable;

$(document).ready(function() {
    cargarUsuarios();
    
    $('#buscarUsuario').on('keyup', function() {
        filtrarTabla();
    });
    
    $('#filtroRol').on('change', function() {
        filtrarTabla();
    });
    
    $('#btnRecargar').on('click', function() {
        cargarUsuarios();
    });
    
    $('#btnExportar').on('click', function() {
        exportarUsuarios();
    });
    
    $('#modalUsuario').on('hidden.bs.modal', function() {
        $('#formUsuario')[0].reset();
        $('#usuarioId').val('');
        $('.modal-title').text('Nuevo Usuario');
        $('#password').prop('required', true);
        $('#estado').val('Activo');
    });
});

async function cargarUsuarios() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            showError('No hay sesión activa. Por favor inicie sesión.');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Cargando usuarios...');
        const response = await fetch('/pcgestor/api/usuarios', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('Sesión expirada. Por favor inicie sesión nuevamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Error al cargar usuarios: ' + response.status);
        }
        
        const text = await response.text();
        console.log('Respuesta cruda:', text);
        
        if (!text || text.trim() === '') {
            throw new Error('Respuesta vacía del servidor');
        }
        
        const usuarios = JSON.parse(text);
        console.log('Usuarios recibidos:', usuarios);
        mostrarTabla(usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        showError('Error al cargar los usuarios: ' + error.message);
        mostrarTabla([]);
    }
}

function mostrarTabla(usuarios) {
    if (usuariosTable) {
        usuariosTable.destroy();
        usuariosTable = null;
    }
    
    const tbody = $('#tablaUsuarios tbody');
    tbody.empty();
    
    if (!usuarios || usuarios.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="7" class="text-center">No hay usuarios registrados</td>
            </tr>
        `);
        
        // Inicializar DataTable con mensaje vacío
        setTimeout(function() {
            usuariosTable = $('#tablaUsuarios').DataTable({
                language: {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                order: [[0, 'desc']],
                pageLength: 10,
                destroy: true
            });
        }, 100);
        return;
    }
    
    usuarios.forEach(u => {
        console.log('Procesando usuario:', u.id, 'activo:', u.activo, 'estado:', u.estado);
        
        let estadoTexto = 'Inactivo';
        let badgeClass = 'bg-secondary';
        
        if (u.activo === 1 || u.activo === true || u.activo === '1') {
            estadoTexto = 'Activo';
            badgeClass = 'bg-success';
        } else if (u.estado === 'Activo' || u.estado === 'activo') {
            estadoTexto = 'Activo';
            badgeClass = 'bg-success';
        }
        
        const nombreCompleto = u.nombre || u.username || 'Sin nombre';
        const correo = u.correo || u.email || u.username || '-';
        const telefono = u.telefono || '-';
        const rol = u.rol || u.role || 'Usuario';
        
        tbody.append(`
            <tr>
                <td>${u.id}</td>
                <td>${nombreCompleto}</td>
                <td>${correo}</td>
                <td>${telefono}</td>
                <td><span class="badge bg-info">${rol}</span></td>
                <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="verUsuario(${u.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${u.activo === 1 ? 'btn-danger' : 'btn-success'}" 
                            onclick="toggleEstadoUsuario(${u.id})" 
                            title="${u.activo === 1 ? 'Deshabilitar' : 'Habilitar'}">
                        <i class="fas ${u.activo === 1 ? 'fa-ban' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="mostrarCambiarPassword(${u.id})" title="Cambiar contraseña">
                        <i class="fas fa-key"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    // Inicializar DataTable después de agregar los datos
    setTimeout(function() {
        usuariosTable = $('#tablaUsuarios').DataTable({
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            order: [[0, 'desc']],
            pageLength: 10,
            destroy: true
        });
    }, 100);
}

function filtrarTabla() {
    const textoBusqueda = $('#buscarUsuario').val().toLowerCase();
    const rolFiltro = $('#filtroRol').val();
    
    if (!usuariosTable) {
        return;
    }
    
    const data = usuariosTable.rows().data();
    const usuariosFiltrados = [];
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const coincideTexto = !textoBusqueda || 
            row.nombre?.toLowerCase().includes(textoBusqueda) || 
            row.correo?.toLowerCase().includes(textoBusqueda) || 
            (row.telefono && row.telefono.includes(textoBusqueda));
        const coincideRol = rolFiltro === 'todos' || row.rol === rolFiltro;
        
        if (coincideTexto && coincideRol) {
            usuariosFiltrados.push(row);
        }
    }
    
    mostrarTabla(usuariosFiltrados);
}

async function guardarUsuario() {
    const id = $('#usuarioId').val();
    const nombre = $('#nombre').val().trim();
    const correo = $('#correo').val().trim();
    const telefono = $('#telefono').val().trim();
    const rol = $('#rol').val();
    const estado = $('#estado').val();
    const password = $('#password').val();
    
    if (!nombre || !correo || !rol) {
        showError('Por favor complete los campos obligatorios');
        return;
    }
    
    const activoValue = estado === 'Activo' ? 1 : 0;
    
    const usuarioData = {
        username: nombre,
        nombre: nombre,
        correo: correo,
        email: correo,
        telefono: telefono || '',
        role: rol,
        estado: estado,
        activo: activoValue
    };
    
    if (!id && (!password || password.length < 6)) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (!id) {
        usuarioData.password = password;
    }
    
    try {
        const token = localStorage.getItem('token');
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/pcgestor/api/usuarios/${id}` : '/pcgestor/api/usuarios';
        
        console.log('Enviando datos al servidor:', usuarioData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuarioData)
        });
        
        if (!response.ok) {
            const text = await response.text();
            let errorMsg = 'Error al guardar usuario';
            try {
                const error = JSON.parse(text);
                errorMsg = error.message || error.error || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        showSuccess(id ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
        $('#modalUsuario').modal('hide');
        cargarUsuarios();
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al guardar el usuario');
    }
}

async function editarUsuario(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar el usuario');
        }
        
        const usuario = await response.json();
        console.log('Usuario a editar:', usuario);
        
        $('#usuarioId').val(usuario.id);
        $('#nombre').val(usuario.nombre || usuario.username || '');
        $('#correo').val(usuario.correo || usuario.email || '');
        $('#telefono').val(usuario.telefono || '');
        $('#rol').val(usuario.rol || usuario.role || '');
        
        let estadoTexto = 'Activo';
        if (usuario.activo === 0 || usuario.activo === false || 
            usuario.estado === 'Inactivo' || usuario.estado === 'inactivo') {
            estadoTexto = 'Inactivo';
        }
        $('#estado').val(estadoTexto);
        
        $('#password').val('');
        $('#password').prop('required', false);
        $('.modal-title').text('Editar Usuario');
        
        $('#modalUsuario').modal('show');
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar el usuario para editar');
    }
}

async function verUsuario(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar el usuario');
        }
        
        const usuario = await response.json();
        
        let estadoTexto = 'Inactivo';
        if (usuario.activo === 1 || usuario.activo === true || 
            usuario.estado === 'Activo' || usuario.estado === 'activo') {
            estadoTexto = 'Activo';
        }
        
        const detalles = `
            <div class="table-responsive">
                <table class="table table-bordered">
                    <tr><th style="width:40%">ID</th><td>${usuario.id}</td></tr>
                    <tr><th>Nombre</th><td>${usuario.nombre || usuario.username || '-'}</td></tr>
                    <tr><th>Correo</th><td>${usuario.correo || usuario.email || '-'}</td></tr>
                    <tr><th>Teléfono</th><td>${usuario.telefono || '-'}</td></tr>
                    <tr><th>Rol</th><td>${usuario.rol || usuario.role || '-'}</td></tr>
                    <tr><th>Estado</th><td>${estadoTexto}</td></tr>
                </table>
            </div>
        `;
        Swal.fire({ 
            title: 'Detalles del Usuario', 
            html: detalles, 
            icon: 'info', 
            confirmButtonText: 'Cerrar' 
        });
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar los detalles del usuario');
    }
}

async function toggleEstadoUsuario(id) {
    try {
        const token = localStorage.getItem('token');
        
        const responseGet = await fetch(`/pcgestor/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!responseGet.ok) {
            throw new Error('Error al obtener el usuario');
        }
        
        const usuario = await responseGet.json();
        const nuevoEstado = usuario.activo === 1 ? 0 : 1;
        const nuevoEstadoTexto = nuevoEstado === 1 ? 'Activo' : 'Inactivo';
        
        showConfirm(`¿Está seguro de ${nuevoEstado === 1 ? 'habilitar' : 'deshabilitar'} este usuario?`, async () => {
            const response = await fetch(`/pcgestor/api/usuarios/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    activo: nuevoEstado,
                    estado: nuevoEstadoTexto
                })
            });
            
            if (!response.ok) {
                const text = await response.text();
                let errorMsg = 'Error al cambiar estado';
                try {
                    const error = JSON.parse(text);
                    errorMsg = error.message || error.error || errorMsg;
                } catch (e) {
                    if (text) errorMsg = text;
                }
                throw new Error(errorMsg);
            }
            
            showSuccess(`Usuario ${nuevoEstadoTexto.toLowerCase()} correctamente`);
            cargarUsuarios();
        });
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al cambiar el estado del usuario');
    }
}

async function eliminarUsuario(id) {
    showConfirm('¿Está seguro de eliminar este usuario?', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/pcgestor/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                const text = await response.text();
                let errorMsg = 'Error al eliminar usuario';
                try {
                    const error = JSON.parse(text);
                    errorMsg = error.message || error.error || errorMsg;
                } catch (e) {
                    if (text) errorMsg = text;
                }
                throw new Error(errorMsg);
            }
            
            showSuccess('Usuario eliminado correctamente');
            cargarUsuarios();
            
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Error al eliminar el usuario');
        }
    });
}

function mostrarCambiarPassword(id) {
    window.usuarioIdPassword = id;
    $('#modalCambiarPassword').modal('show');
}

async function cambiarPassword() {
    const nueva = $('#nuevaPassword').val();
    const confirmar = $('#confirmarPassword').val();
    const id = window.usuarioIdPassword;
    
    if (!nueva || nueva.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    if (nueva !== confirmar) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/usuarios/${id}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: nueva })
        });
        
        if (!response.ok) {
            const text = await response.text();
            let errorMsg = 'Error al cambiar contraseña';
            try {
                const error = JSON.parse(text);
                errorMsg = error.message || error.error || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }
        
        showSuccess('Contraseña actualizada correctamente');
        $('#modalCambiarPassword').modal('hide');
        $('#formCambiarPassword')[0].reset();
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al cambiar la contraseña');
    }
}

function exportarUsuarios() {
    if (!usuariosTable) {
        showError('No hay datos para exportar');
        return;
    }
    
    const data = usuariosTable.rows().data();
    let csv = "ID,Nombre,Correo,Teléfono,Rol,Estado\n";
    
    for (let i = 0; i < data.length; i++) {
        const u = data[i];
        csv += `${u.id},"${u.nombre || u.username || ''}","${u.correo || u.email || ''}","${u.telefono || ''}",${u.rol || u.role || ''},${u.estado || 'Activo'}\n`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showSuccess('Exportación completada');
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: message,
        timer: 2000,
        showConfirmButton: false
    });
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

function showWarning(message) {
    Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: message
    });
}

function showConfirm(message, callback) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}