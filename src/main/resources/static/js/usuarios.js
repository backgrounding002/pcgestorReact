// usuarios.js - Gestión de usuarios con datos simulados

let usuariosTable;
let listaUsuarios = [
    { id: 1, nombre: 'Federico', correo: 'fedro@example.com', telefono: '3001234567', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Laura', correo: 'laura@example.com', telefono: '3109876543', rol: 'Empleado', estado: 'Activo' },
    { id: 3, nombre: 'Javier', correo: 'javier@example.com', telefono: '3204567890', rol: 'Técnico', estado: 'Activo' },
    { id: 4, nombre: 'María', correo: 'maria@example.com', telefono: '3012345678', rol: 'Empleado', estado: 'Activo' }
];

$(document).ready(function() {
    cargarTablaUsuarios();
    
    // Evento buscar
    $('#buscarUsuario').on('keyup', function() {
        filtrarTabla();
    });
    
    // Evento filtro por rol
    $('#filtroRol').on('change', function() {
        filtrarTabla();
    });
    
    // Botón recargar
    $('#btnRecargar').on('click', function() {
        cargarTablaUsuarios();
    });
    
    // Botón exportar
    $('#btnExportar').on('click', function() {
        exportarUsuarios();
    });
    
    // Al cerrar el modal, resetear formulario
    $('#modalUsuario').on('hidden.bs.modal', function() {
        $('#formUsuario')[0].reset();
        $('#usuarioId').val('');
        $('.modal-title').text('Nuevo Usuario');
        $('#password').prop('required', true);
    });
});

function cargarTablaUsuarios() {
    if (usuariosTable) usuariosTable.destroy();
    mostrarUsuarios(listaUsuarios);
}

function mostrarUsuarios(usuarios) {
    const tbody = $('#tablaUsuarios tbody');
    tbody.empty();
    
    usuarios.forEach(u => {
        const estadoBadge = u.estado === 'Activo' 
            ? '<span class="badge bg-success">Activo</span>' 
            : '<span class="badge bg-secondary">Inactivo</span>';
        
        tbody.append(`
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.telefono || '-'}</td>
                <td><span class="badge bg-info">${u.rol}</span></td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="verUsuario(${u.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.id})" title="Editar">
                        <i class="fas fa-edit"></i>
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
    
    usuariosTable = $('#tablaUsuarios').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        order: [[0, 'desc']],
        pageLength: 10,
        destroy: true
    });
}

function filtrarTabla() {
    const textoBusqueda = $('#buscarUsuario').val().toLowerCase();
    const rolFiltro = $('#filtroRol').val();
    
    let filtrados = listaUsuarios.filter(u => {
        const coincideTexto = !textoBusqueda || 
            u.nombre.toLowerCase().includes(textoBusqueda) || 
            u.correo.toLowerCase().includes(textoBusqueda) || 
            (u.telefono && u.telefono.includes(textoBusqueda));
        const coincideRol = rolFiltro === 'todos' || u.rol === rolFiltro;
        return coincideTexto && coincideRol;
    });
    
    mostrarUsuarios(filtrados);
}

function guardarUsuario() {
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
    
    if (!id && (!password || password.length < 6)) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (id) {
        // Editar usuario existente
        const index = listaUsuarios.findIndex(u => u.id == id);
        if (index !== -1) {
            listaUsuarios[index] = {
                ...listaUsuarios[index],
                nombre: nombre,
                correo: correo,
                telefono: telefono,
                rol: rol,
                estado: estado
            };
            showSuccess('Usuario actualizado correctamente');
        }
    } else {
        // Crear nuevo usuario
        const nuevoId = listaUsuarios.length ? Math.max(...listaUsuarios.map(u => u.id)) + 1 : 5;
        listaUsuarios.push({
            id: nuevoId,
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            rol: rol,
            estado: estado
        });
        showSuccess('Usuario creado correctamente');
    }
    
    $('#modalUsuario').modal('hide');
    cargarTablaUsuarios();
}

function editarUsuario(id) {
    const usuario = listaUsuarios.find(u => u.id == id);
    if (!usuario) return;
    
    $('#usuarioId').val(usuario.id);
    $('#nombre').val(usuario.nombre);
    $('#correo').val(usuario.correo);
    $('#telefono').val(usuario.telefono || '');
    $('#rol').val(usuario.rol);
    $('#estado').val(usuario.estado);
    $('#password').val(''); // vacío, no requerido en edición
    $('#password').prop('required', false);
    $('.modal-title').text('Editar Usuario');
    
    $('#modalUsuario').modal('show');
}

function verUsuario(id) {
    const usuario = listaUsuarios.find(u => u.id == id);
    if (!usuario) return;
    
    const detalles = `
        <div class="table-responsive">
            <table class="table table-bordered">
                <tr><th style="width:40%">ID</th><td>${usuario.id}</td></tr>
                <tr><th>Nombre</th><td>${usuario.nombre}</td></tr>
                <tr><th>Correo</th><td>${usuario.correo}</td></tr>
                <tr><th>Teléfono</th><td>${usuario.telefono || '-'}</td></tr>
                <tr><th>Rol</th><td>${usuario.rol}</td></tr>
                <tr><th>Estado</th><td>${usuario.estado}</td></tr>
            </table>
        </div>
    `;
    Swal.fire({ title: 'Detalles del Usuario', html: detalles, icon: 'info', confirmButtonText: 'Cerrar' });
}

function eliminarUsuario(id) {
    const usuario = listaUsuarios.find(u => u.id == id);
    showConfirm(`¿Está seguro de eliminar al usuario "${usuario.nombre}"?`, () => {
        listaUsuarios = listaUsuarios.filter(u => u.id != id);
        showSuccess('Usuario eliminado correctamente');
        cargarTablaUsuarios();
    });
}

function mostrarCambiarPassword(id) {
    window.usuarioIdPassword = id;
    $('#modalCambiarPassword').modal('show');
}

function cambiarPassword() {
    const nueva = $('#nuevaPassword').val();
    const confirmar = $('#confirmarPassword').val();
    
    if (!nueva || nueva.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    if (nueva !== confirmar) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    // Simular cambio de contraseña (en backend real harías petición)
    showSuccess('Contraseña actualizada correctamente');
    $('#modalCambiarPassword').modal('hide');
    $('#formCambiarPassword')[0].reset();
}

function exportarUsuarios() {
    let csv = "ID,Nombre,Correo,Teléfono,Rol,Estado\n";
    listaUsuarios.forEach(u => {
        csv += `${u.id},"${u.nombre}","${u.correo}","${u.telefono || ''}",${u.rol},${u.estado}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showSuccess('Exportación completada');
}