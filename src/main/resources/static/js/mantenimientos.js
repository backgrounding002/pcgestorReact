let mantenimientosTable;

$(document).ready(function() {
    cargarMantenimientos();
    cargarSelects();

    $('#modalMantenimiento').on('hidden.bs.modal', function() {
        $('#formMantenimiento')[0].reset();
        $('#mantenimientoId').val('');
        $('.modal-title').text('Registrar mantenimiento');
    });
});

async function cargarSelects() {
    try {
        const token = localStorage.getItem('token');

        // Cargar equipos
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

        // Cargar técnicos (usuarios con rol Técnico)
        const usuariosResponse = await fetch('/pcgestor/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usuariosResponse.ok) {
            const usuarios = await usuariosResponse.json();
            const selectTecnico = $('#tecnicoId');
            selectTecnico.empty();
            selectTecnico.append('<option value="">Seleccionar técnico</option>');
            if (Array.isArray(usuarios)) {
                usuarios.forEach(usr => {
                    // Filtrar solo técnicos (puedes ajustar según tu lógica de roles)
                    if (usr.role === 'Técnico' || usr.rol === 'Técnico') {
                        const nombre = usr.nombre || usr.username || 'Sin nombre';
                        const texto = `${nombre} - ${usr.email || usr.username || ''}`;
                        selectTecnico.append(`<option value="${usr.id}">${texto}</option>`);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar selects:', error);
        showError('Error al cargar los datos para los selectores');
    }
}

async function cargarMantenimientos() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pcgestor/api/mantenimientos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar mantenimientos');

        const data = await response.json();
        let mantenimientos = Array.isArray(data) ? data : [];
        mostrarTabla(mantenimientos);
    } catch (error) {
        console.error('Error al cargar mantenimientos:', error);
        showError('Error al cargar los mantenimientos: ' + error.message);
        mostrarTabla([]);
    }
}

function mostrarTabla(mantenimientos) {
    if (mantenimientosTable) {
        try {
            mantenimientosTable.destroy();
        } catch (e) {
            console.warn('Error al destruir DataTable:', e);
        }
        mantenimientosTable = null;
    }

    const tbody = $('#tablaMantenimientos tbody');
    tbody.empty();

    if (!Array.isArray(mantenimientos) || mantenimientos.length === 0) {
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
        mantenimientos.forEach(m => {
            const equipoInfo = m.equipo ? 
                `${m.equipo.marca || ''} ${m.equipo.modelo || ''}`.trim() || `Equipo ID: ${m.equipoId}` :
                `Equipo ID: ${m.equipoId}`;

            const tecnicoInfo = m.tecnico ?
                m.tecnico.username || m.tecnico.nombre || 'Técnico' :
                `Técnico ID: ${m.tecnicoId}`;

            const costoFormateado = m.costo ? `$${Number(m.costo).toFixed(2)}` : '-';

            tbody.append(`
                <tr>
                    <td>${m.idMantenimiento || m.id_mantenimiento || '-'}</td>
                    <td>${m.fecha || '-'}</td>
                    <td>${m.tipo || '-'}</td>
                    <td>${equipoInfo}</td>
                    <td>${tecnicoInfo}</td>
                    <td>${costoFormateado}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarMantenimiento(${m.idMantenimiento || m.id_mantenimiento})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarMantenimiento(${m.idMantenimiento || m.id_mantenimiento})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    setTimeout(function() {
        try {
            mantenimientosTable = $('#tablaMantenimientos').DataTable({
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

async function guardarMantenimiento() {
    const id = $('#mantenimientoId').val();
    const fecha = $('#fecha').val();
    const tipo = $('#tipo').val();
    const descripcion = $('#descripcion').val().trim();
    const costo = parseFloat($('#costo').val()) || 0;
    const equipoId = $('#equipoId').val();
    const tecnicoId = $('#tecnicoId').val();

    if (!fecha || !tipo || !equipoId || !tecnicoId) {
        showError('Los campos Fecha, Tipo, Equipo y Técnico son obligatorios');
        return;
    }

    const mantenimientoData = {
        fecha: fecha,
        tipo: tipo,
        descripcion: descripcion,
        costo: costo,
        equipoId: parseInt(equipoId),
        tecnicoId: parseInt(tecnicoId)
    };
    if (id) mantenimientoData.idMantenimiento = parseInt(id);

    try {
        const token = localStorage.getItem('token');
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/pcgestor/api/mantenimientos/${id}` : '/pcgestor/api/mantenimientos';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(mantenimientoData)
        });

        if (!response.ok) {
            const text = await response.text();
            let errorMsg = 'Error al guardar';
            try {
                const error = JSON.parse(text);
                errorMsg = error.message || error.error || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }

        showSuccess(id ? 'Mantenimiento actualizado' : 'Mantenimiento registrado');
        $('#modalMantenimiento').modal('hide');
        cargarMantenimientos();
        cargarSelects();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al guardar el mantenimiento');
    }
}

function editarMantenimiento(id) {
    // Buscar la fila en la tabla
    const row = $(`#tablaMantenimientos tbody tr`).filter(function() {
        return $(this).find('td:first').text() == id;
    });

    if (row.length > 0) {
        const celdas = row.find('td');
        const fecha = celdas.eq(1).text().trim();
        const tipo = celdas.eq(2).text().trim();
        const equipoTexto = celdas.eq(3).text().trim();
        const tecnicoTexto = celdas.eq(4).text().trim();
        const costoTexto = celdas.eq(5).text().trim().replace('$', '').replace(',', '');
        const costo = parseFloat(costoTexto) || 0;
        const descripcion = ''; // No se muestra en la tabla, lo cargaremos desde la API

        $('#mantenimientoId').val(id);
        $('#fecha').val(fecha);
        $('#tipo').val(tipo);
        $('#costo').val(costo);
        // Cargar descripción desde la API para tener el valor completo
        cargarMantenimientoDesdeAPI(id);
    } else {
        cargarMantenimientoDesdeAPI(id);
    }
}

async function cargarMantenimientoDesdeAPI(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/mantenimientos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar el mantenimiento');

        const mantenimiento = await response.json();
        console.log('Mantenimiento a editar:', mantenimiento);

        $('#mantenimientoId').val(mantenimiento.idMantenimiento || mantenimiento.id_mantenimiento);
        $('#fecha').val(mantenimiento.fecha);
        $('#tipo').val(mantenimiento.tipo);
        $('#descripcion').val(mantenimiento.descripcion || '');
        $('#costo').val(mantenimiento.costo || 0);
        $('#equipoId').val(mantenimiento.equipoId || mantenimiento.equipo_id);
        $('#tecnicoId').val(mantenimiento.tecnicoId || mantenimiento.tecnico_id);

        $('.modal-title').text('Editar mantenimiento');
        $('#modalMantenimiento').modal('show');
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar el mantenimiento para editar');
    }
}

function eliminarMantenimiento(id) {
    showConfirm('¿Está seguro de eliminar este mantenimiento?', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/pcgestor/api/mantenimientos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
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
            showSuccess('Mantenimiento eliminado correctamente');
            cargarMantenimientos();
        } catch (error) {
            console.error('Error al eliminar mantenimiento:', error);
            showError(error.message || 'Error al eliminar el mantenimiento');
        }
    });
}

// Funciones auxiliares (showSuccess, showError, showConfirm) ya están en main.js o puedes copiarlas de otros módulos