let equiposTable;

$(document).ready(function() {
    cargarEquipos();
    cargarSelects();
    
    $('#modalEquipo').on('hidden.bs.modal', function() {
        $('#formEquipo')[0].reset();
        $('#equipoId').val('');
        $('.modal-title').text('Registrar equipo');
        $('#estadoId').val('');
        $('#ubicacionId').val('');
        $('#tipoId').val('');
    });
});

async function cargarSelects() {
    try {
        const token = localStorage.getItem('token');
        
        const resEstados = await fetch('/pcgestor/api/estados-equipo', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resEstados.ok) {
            const estados = await resEstados.json();
            const select = $('#estadoId');
            select.empty();
            select.append('<option value="">Seleccionar estado</option>');
            estados.forEach(e => {
                select.append(`<option value="${e.id}">${e.nombre}</option>`);
            });
        }
        
        const resUbicaciones = await fetch('/pcgestor/api/ubicaciones', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resUbicaciones.ok) {
            const ubicaciones = await resUbicaciones.json();
            const select = $('#ubicacionId');
            select.empty();
            select.append('<option value="">Seleccionar ubicación</option>');
            ubicaciones.forEach(u => {
                const texto = `${u.edificio} - ${u.piso} - ${u.sala}`;
                select.append(`<option value="${u.idUbicacion}">${texto}</option>`);
            });
        }
        
        const resTipos = await fetch('/pcgestor/api/tipos-equipo', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resTipos.ok) {
            const tipos = await resTipos.json();
            const select = $('#tipoId');
            select.empty();
            select.append('<option value="">Seleccionar tipo</option>');
            tipos.forEach(t => {
                select.append(`<option value="${t.id}">${t.nombre}</option>`);
            });
        }
    } catch (error) {
        console.error('Error al cargar selects:', error);
        showError('Error al cargar los datos de los selectores');
    }
}

async function cargarEquipos() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showError('No hay sesión activa');
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch('/pcgestor/api/equipos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar equipos');
        const equipos = await response.json();
        console.log('Equipos cargados (datos crudos):', equipos);
        mostrarTabla(equipos);
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        showError('Error al cargar los equipos: ' + error.message);
        mostrarTabla([]);
    }
}

function obtenerTextoUbicacion(equipo) {
    // Función auxiliar para obtener el texto de ubicación de forma segura
    if (!equipo) return 'Sin ubicación';
    
    // Caso 1: ubicacionEntity es un objeto con propiedades
    if (equipo.ubicacionEntity && typeof equipo.ubicacionEntity === 'object') {
        const u = equipo.ubicacionEntity;
        // Intentar construir con edificio, piso, sala
        if (u.edificio || u.piso || u.sala) {
            return `${u.edificio || ''} - ${u.piso || ''} - ${u.sala || ''}`.replace(/^ - | - $/g, '');
        }
        // Si tiene descripción
        if (u.descripcion) return u.descripcion;
        // Si tiene nombre (otra posible estructura)
        if (u.nombre) return u.nombre;
        // Si tiene idUbicacion pero sin texto, devolver ID
        if (u.idUbicacion) return `Ubicación ID: ${u.idUbicacion}`;
        // Fallback: convertir a JSON (no deseado, pero evita [object Object])
        return JSON.stringify(u);
    }
    
    // Caso 2: ubicacion es un string directo (estructura antigua)
    if (equipo.ubicacion && typeof equipo.ubicacion === 'string') {
        return equipo.ubicacion;
    }
    
    // Caso 3: ubicacion es un objeto pero está en otro campo (ej: 'ubicacion' en lugar de 'ubicacionEntity')
    if (equipo.ubicacion && typeof equipo.ubicacion === 'object') {
        const u = equipo.ubicacion;
        if (u.edificio || u.piso || u.sala) {
            return `${u.edificio || ''} - ${u.piso || ''} - ${u.sala || ''}`.replace(/^ - | - $/g, '');
        }
        if (u.descripcion) return u.descripcion;
        if (u.nombre) return u.nombre;
        return JSON.stringify(u);
    }
    
    return 'Sin ubicación';
}

function mostrarTabla(equipos) {
    if (equiposTable) {
        equiposTable.destroy();
        equiposTable = null;
    }
    
    const tbody = $('#tablaEquipos tbody');
    tbody.empty();
    
    if (!equipos || equipos.length === 0) {
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
        equipos.forEach(eq => {
            // Estado
            let estadoNombre = 'Sin estado';
            let badgeClass = 'bg-secondary';
            if (eq.estado) {
                estadoNombre = eq.estado.nombre || 'Sin estado';
                if (estadoNombre === 'Activo') badgeClass = 'bg-success';
                else if (estadoNombre === 'En mantenimiento') badgeClass = 'bg-warning';
                else if (estadoNombre === 'Dado de baja' || estadoNombre === 'Retirado') badgeClass = 'bg-danger';
            }
            
            // Ubicación - usar función auxiliar
            const ubicacionTexto = obtenerTextoUbicacion(eq);
            
            // Tipo
            let tipoNombre = 'Sin tipo';
            if (eq.tipo) {
                tipoNombre = eq.tipo.nombre || 'Sin tipo';
            }
            
            tbody.append(`
                <tr>
                    <td>${eq.id}</td>
                    <td>${eq.marca || '-'}</td>
                    <td>${eq.modelo || '-'}</td>
                    <td>${eq.serial || '-'}</td>
                    <td><span class="badge ${badgeClass}">${estadoNombre}</span></td>
                    <td>${ubicacionTexto}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarEquipo(${eq.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarEquipo(${eq.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
    
    setTimeout(function() {
        equiposTable = $('#tablaEquipos').DataTable({
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

async function guardarEquipo() {
    const id = $('#equipoId').val();
    const marca = $('#marca').val().trim();
    const modelo = $('#modelo').val().trim();
    const serial = $('#serial').val().trim();
    const procesador = $('#procesador').val().trim();
    const memoriaRAM = $('#memoriaRAM').val().trim();
    const almacenamiento = $('#almacenamiento').val().trim();
    const estadoId = $('#estadoId').val();
    const ubicacionId = $('#ubicacionId').val();
    const tipoId = $('#tipoId').val();

    if (!marca || !modelo || !serial) {
        showError('Los campos Marca, Modelo y Serial son obligatorios');
        return;
    }
    if (!estadoId) { showError('Debe seleccionar un estado'); return; }
    if (!ubicacionId) { showError('Debe seleccionar una ubicación'); return; }
    if (!tipoId) { showError('Debe seleccionar un tipo de equipo'); return; }

    const estadoIdNum = Number(estadoId);
    const ubicacionIdNum = Number(ubicacionId);
    const tipoIdNum = Number(tipoId);

    if (isNaN(estadoIdNum) || isNaN(ubicacionIdNum) || isNaN(tipoIdNum)) {
        showError('Los IDs seleccionados no son válidos');
        return;
    }

    const equipoData = {
        marca: marca,
        modelo: modelo,
        serial: serial,
        procesador: procesador || null,
        memoriaRAM: memoriaRAM || null,
        almacenamiento: almacenamiento || null,
        estadoId: estadoIdNum,
        ubicacionId: ubicacionIdNum,
        tipoId: tipoIdNum
    };
    if (id) equipoData.id = Number(id);

    console.log('Datos a enviar al backend:', equipoData);

    try {
        const token = localStorage.getItem('token');
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/pcgestor/api/equipos/${id}` : '/pcgestor/api/equipos';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(equipoData)
        });

        if (!response.ok) {
            const text = await response.text();
            let errorMsg = 'Error al guardar';
            try {
                const data = JSON.parse(text);
                errorMsg = data.error || data.message || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            if (errorMsg.toLowerCase().includes('serial') && 
                (errorMsg.toLowerCase().includes('existente') || errorMsg.toLowerCase().includes('registrado') || errorMsg.toLowerCase().includes('duplicado'))) {
                showError('⚠️ El serial ya está registrado. Por favor, ingresa un serial diferente.');
            } else {
                showError(errorMsg);
            }
            return;
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        showSuccess(id ? 'Equipo actualizado' : 'Equipo registrado');
        $('#modalEquipo').modal('hide');
        cargarEquipos();
        cargarSelects();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al guardar el equipo');
    }
}

function editarEquipo(id) {
    const row = $(`#tablaEquipos tbody tr`).filter(function() {
        return $(this).find('td:first').text() == id;
    });
    
    if (row.length > 0) {
        const celdas = row.find('td');
        const marca = celdas.eq(1).text().trim();
        const modelo = celdas.eq(2).text().trim();
        const serial = celdas.eq(3).text().trim();
        
        $('#equipoId').val(id);
        $('#marca').val(marca);
        $('#modelo').val(modelo);
        $('#serial').val(serial);
        
        cargarEquipoDesdeAPI(id);
    } else {
        cargarEquipoDesdeAPI(id);
    }
}

async function cargarEquipoDesdeAPI(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/equipos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar el equipo');
        
        const equipo = await response.json();
        console.log('Equipo a editar:', equipo);
        
        $('#equipoId').val(equipo.id);
        $('#marca').val(equipo.marca || '');
        $('#modelo').val(equipo.modelo || '');
        $('#serial').val(equipo.serial || '');
        $('#procesador').val(equipo.procesador || '');
        $('#memoriaRAM').val(equipo.memoriaRAM || '');
        $('#almacenamiento').val(equipo.almacenamiento || '');
        
        if (equipo.estado && equipo.estado.id) {
            $('#estadoId').val(equipo.estado.id);
        }
        if (equipo.ubicacionEntity && equipo.ubicacionEntity.idUbicacion) {
            $('#ubicacionId').val(equipo.ubicacionEntity.idUbicacion);
        } else if (equipo.ubicacion && equipo.ubicacion.idUbicacion) {
            $('#ubicacionId').val(equipo.ubicacion.idUbicacion);
        }
        if (equipo.tipo && equipo.tipo.id) {
            $('#tipoId').val(equipo.tipo.id);
        }
        
        $('.modal-title').text('Editar equipo');
        $('#modalEquipo').modal('show');
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar el equipo para editar');
    }
}

function eliminarEquipo(id) {
    showConfirm('¿Está seguro de eliminar este equipo?', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/pcgestor/api/equipos/${id}`, {
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
                    const data = JSON.parse(text);
                    errorMsg = data.error || data.message || errorMsg;
                } catch (e) {
                    if (text) errorMsg = text;
                }
                throw new Error(errorMsg);
            }
            
            showSuccess('Equipo eliminado correctamente');
            cargarEquipos();
        } catch (error) {
            console.error('Error al eliminar equipo:', error);
            showError(error.message || 'Error al eliminar el equipo');
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
        text: message,
        confirmButtonColor: '#d33'
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
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}