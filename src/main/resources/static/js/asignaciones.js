let asignacionesTable;

$(document).ready(function() {
    cargarAsignaciones();
    cargarSelects();
    
    $('#modalAsignacion').on('hidden.bs.modal', function() {
        $('#formAsignacion')[0].reset();
        $('#asignacionId').val('');
        $('.modal-title').text('Nueva asignación');
        $('#activa').prop('checked', true);
    });
});

async function cargarSelects() {
    try {
        const token = localStorage.getItem('token');
        
        // Cargar equipos disponibles
        console.log('Cargando equipos...');
        const equiposResponse = await fetch('/pcgestor/api/equipos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (equiposResponse.ok) {
            const equipos = await equiposResponse.json();
            console.log('Equipos recibidos:', equipos);
            const selectEquipo = $('#equipoId');
            selectEquipo.empty();
            selectEquipo.append('<option value="">Seleccionar equipo</option>');
            if (Array.isArray(equipos)) {
                equipos.forEach(eq => {
                    const texto = `${eq.marca} ${eq.modelo} - ${eq.serial}`;
                    selectEquipo.append(`<option value="${eq.id}">${texto}</option>`);
                });
            }
        } else {
            console.error('Error al cargar equipos:', equiposResponse.status);
        }
        
        // Cargar usuarios disponibles
        console.log('Cargando usuarios...');
        const usuariosResponse = await fetch('/pcgestor/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (usuariosResponse.ok) {
            const usuarios = await usuariosResponse.json();
            console.log('Usuarios recibidos:', usuarios);
            const selectUsuario = $('#usuarioId');
            selectUsuario.empty();
            selectUsuario.append('<option value="">Seleccionar empleado</option>');
            if (Array.isArray(usuarios)) {
                usuarios.forEach(usr => {
                    const nombre = usr.nombre || usr.username || 'Sin nombre';
                    const texto = `${nombre} - ${usr.email || usr.username || ''}`;
                    selectUsuario.append(`<option value="${usr.id}">${texto}</option>`);
                });
            }
        } else {
            console.error('Error al cargar usuarios:', usuariosResponse.status);
        }
        
    } catch (error) {
        console.error('Error al cargar selects:', error);
        showError('Error al cargar los datos para los selectores');
    }
}

async function cargarAsignaciones() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pcgestor/api/asignaciones', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar asignaciones');
        
        const data = await response.json();
        console.log('Asignaciones recibidas:', data);
        
        // Asegurar que sea un array
        let asignaciones = Array.isArray(data) ? data : [];
        mostrarTabla(asignaciones);
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
        showError('Error al cargar las asignaciones: ' + error.message);
        mostrarTabla([]);
    }
}

function mostrarTabla(asignaciones) {
    // Destruir tabla anterior si existe
    if (asignacionesTable) {
        try {
            asignacionesTable.destroy();
        } catch (e) {
            console.warn('Error al destruir DataTable:', e);
        }
        asignacionesTable = null;
    }
    
    const tbody = $('#tablaAsignaciones tbody');
    tbody.empty();
    
    // Asegurar que asignaciones sea un array
    if (!Array.isArray(asignaciones)) {
        asignaciones = [];
    }
    
    if (asignaciones.length === 0) {
        // SOLUCIÓN: Reemplazar colspan por 7 celdas individuales
        tbody.append(`
            <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
            </tr>
        `);
    } else {
        asignaciones.forEach(asig => {
            // Obtener datos del equipo y usuario
            const equipoInfo = asig.equipo ? 
                `${asig.equipo.marca || ''} ${asig.equipo.modelo || ''}`.trim() || `Equipo ID: ${asig.equipoId || asig.equipo_id || '-'}` : 
                `Equipo ID: ${asig.equipoId || asig.equipo_id || '-'}`;
            
            const usuarioInfo = asig.usuario ? 
                (asig.usuario.nombre || asig.usuario.username || 'Usuario') : 
                `Usuario ID: ${asig.usuarioId || asig.usuario_id || '-'}`;
            
            const motivo = asig.motivo || '-';
            const fecha = asig.fechaAsignacion || asig.fecha_asignacion || '-';
            
            let badgeClass = asig.activa ? 'bg-success' : 'bg-secondary';
            let estadoTexto = asig.activa ? 'Activa' : 'Inactiva';
            
            const idAsignacion = asig.idAsignacion || asig.id_asignacion || 0;
            
            tbody.append(`
                <tr>
                    <td>${idAsignacion}</td>
                    <td>${fecha}</td>
                    <td>${equipoInfo}</td>
                    <td>${usuarioInfo}</td>
                    <td>${motivo}</td>
                    <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarAsignacion(${idAsignacion})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm ${asig.activa ? 'btn-danger' : 'btn-info'}" 
                                onclick="cambiarEstadoAsignacion(${idAsignacion}, ${asig.activa})">
                            <i class="fas ${asig.activa ? 'fa-times' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarAsignacion(${idAsignacion})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
    
    // Inicializar DataTable después de que el DOM esté listo
    setTimeout(function() {
        try {
            asignacionesTable = $('#tablaAsignaciones').DataTable({
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
        } catch (error) {
            console.error('Error al inicializar DataTable:', error);
        }
    }, 100);
}

async function guardarAsignacion() {
    const id = $('#asignacionId').val();
    const fecha = $('#fechaAsignacion').val();
    const motivo = $('#motivo').val().trim();
    const equipoId = $('#equipoId').val();
    const usuarioId = $('#usuarioId').val();
    const activa = $('#activa').is(':checked');
    
    if (!fecha || !equipoId || !usuarioId) {
        showError('Los campos Fecha, Equipo y Empleado son obligatorios');
        return;
    }
    
    const asignacion = {
        fechaAsignacion: fecha,
        motivo: motivo,
        equipoId: parseInt(equipoId),
        usuarioId: parseInt(usuarioId),
        activa: activa
    };
    
    if (id) {
        asignacion.idAsignacion = parseInt(id);
    }
    
    try {
        const token = localStorage.getItem('token');
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/pcgestor/api/asignaciones/${id}` : '/pcgestor/api/asignaciones';
        
        console.log('Enviando asignación:', asignacion);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(asignacion)
        });
        
        if (!response.ok) {
            const text = await response.text();
            console.error('Error response:', text);
            let errorMsg = 'Error al guardar';
            try {
                const error = JSON.parse(text);
                errorMsg = error.message || error.error || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        console.log('Respuesta:', data);
        showSuccess(id ? 'Asignación actualizada' : 'Asignación registrada');
        $('#modalAsignacion').modal('hide');
        cargarAsignaciones();
        cargarSelects();
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al guardar la asignación');
    }
}

function editarAsignacion(id) {
    const row = $(`#tablaAsignaciones tbody tr`).filter(function() {
        return $(this).find('td:first').text() == id;
    });
    
    if (row.length > 0) {
        const celdas = row.find('td');
        const fecha = celdas.eq(1).text().trim();
        const motivo = celdas.eq(4).text().trim() === '-' ? '' : celdas.eq(4).text().trim();
        const estado = celdas.eq(5).text().trim();
        const activa = estado === 'Activa';
        
        $('#asignacionId').val(id);
        $('#fechaAsignacion').val(fecha);
        $('#motivo').val(motivo);
        $('#activa').prop('checked', activa);
        
        // Cargar los selects con los valores correctos
        cargarSelectsConValores(id);
        
        $('.modal-title').text('Editar asignación');
        $('#modalAsignacion').modal('show');
    } else {
        cargarAsignacionDesdeAPI(id);
    }
}

async function cargarAsignacionDesdeAPI(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/asignaciones/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar la asignación');
        
        const asignacion = await response.json();
        console.log('Asignación a editar:', asignacion);
        
        $('#asignacionId').val(asignacion.idAsignacion || asignacion.id_asignacion);
        $('#fechaAsignacion').val(asignacion.fechaAsignacion || asignacion.fecha_asignacion);
        $('#motivo').val(asignacion.motivo || '');
        $('#equipoId').val(asignacion.equipoId || asignacion.equipo_id);
        $('#usuarioId').val(asignacion.usuarioId || asignacion.usuario_id);
        $('#activa').prop('checked', asignacion.activa);
        
        $('.modal-title').text('Editar asignación');
        $('#modalAsignacion').modal('show');
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar la asignación para editar');
    }
}

async function cargarSelectsConValores(id) {
    try {
        const token = localStorage.getItem('token');
        
        const equiposResponse = await fetch('/pcgestor/api/equipos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (equiposResponse.ok) {
            const equipos = await equiposResponse.json();
            const selectEquipo = $('#equipoId');
            selectEquipo.empty();
            selectEquipo.append('<option value="">Seleccionar equipo</option>');
            if (Array.isArray(equipos)) {
                equipos.forEach(eq => {
                    const texto = `${eq.marca} ${eq.modelo} - ${eq.serial}`;
                    selectEquipo.append(`<option value="${eq.id}">${texto}</option>`);
                });
            }
        }
        
        const usuariosResponse = await fetch('/pcgestor/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (usuariosResponse.ok) {
            const usuarios = await usuariosResponse.json();
            const selectUsuario = $('#usuarioId');
            selectUsuario.empty();
            selectUsuario.append('<option value="">Seleccionar empleado</option>');
            if (Array.isArray(usuarios)) {
                usuarios.forEach(usr => {
                    const nombre = usr.nombre || usr.username || 'Sin nombre';
                    const texto = `${nombre} - ${usr.email || usr.username || ''}`;
                    selectUsuario.append(`<option value="${usr.id}">${texto}</option>`);
                });
            }
        }
        
    } catch (error) {
        console.error('Error al cargar selects:', error);
    }
}

function cambiarEstadoAsignacion(id, estadoActual) {
    const nuevoEstado = !estadoActual;
    const mensaje = nuevoEstado ? 'activar' : 'desactivar';
    
    showConfirm(`¿Está seguro de ${mensaje} esta asignación?`, async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`/pcgestor/api/asignaciones/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ activa: nuevoEstado })
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
            
            showSuccess(`Asignación ${mensaje}da correctamente`);
            cargarAsignaciones();
            
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            showError(error.message || 'Error al cambiar estado');
        }
    });
}

function eliminarAsignacion(id) {
    showConfirm('¿Está seguro de eliminar esta asignación? Esta acción no se puede deshacer.', async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`/pcgestor/api/asignaciones/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const text = await response.text();
                let errorMsg = 'Error al eliminar';
                try {
                    const error = JSON.parse(text);
                    errorMsg = error.message || error.error || errorMsg;
                } catch (e) {
                    if (text) errorMsg = text;
                }
                throw new Error(errorMsg);
            }
            
            showSuccess('Asignación eliminada correctamente');
            cargarAsignaciones();
            
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            showError(error.message || 'Error al eliminar la asignación');
        }
    });
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