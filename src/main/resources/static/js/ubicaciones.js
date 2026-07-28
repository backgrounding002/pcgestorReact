// ubicaciones.js - Gestión de ubicaciones con API real

let ubicacionesTable;

$(document).ready(function() {
    cargarUbicaciones();

    $('#buscarUbicacion').on('keyup', function() {
        filtrarTabla();
    });

    $('#filtroEdificio').on('change', function() {
        filtrarTabla();
    });

    $('#btnRecargar').on('click', function() {
        cargarUbicaciones();
    });

    $('#modalUbicacion').on('hidden.bs.modal', function() {
        $('#formUbicacion')[0].reset();
        $('#ubicacionId').val('');
        $('.modal-title').text('Registrar ubicación');
    });
});

async function cargarUbicaciones() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showError('No hay sesión activa. Por favor inicie sesión.');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/pcgestor/api/ubicaciones', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                showError('Sesión expirada. Por favor inicie sesión nuevamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Error al cargar ubicaciones: ' + response.status);
        }

        const data = await response.json();
        console.log('Ubicaciones recibidas:', data);
        const ubicaciones = Array.isArray(data) ? data : [];
        mostrarTabla(ubicaciones);
    } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        showError('Error al cargar las ubicaciones: ' + error.message);
        mostrarTabla([]);
    }
}

function mostrarTabla(ubicaciones) {
    if (ubicacionesTable) {
        try {
            ubicacionesTable.destroy();
        } catch (e) {
            console.warn('Error al destruir DataTable:', e);
        }
        ubicacionesTable = null;
    }

    const tbody = $('#tablaUbicaciones tbody');
    tbody.empty();

    if (!Array.isArray(ubicaciones) || ubicaciones.length === 0) {
        tbody.append(`
            <tr>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
                <td class="text-center">-</td>
            </tr>
        `);
    } else {
        ubicaciones.forEach(u => {
            const descripcion = u.descripcion || '-';
            const idUbicacion = u.idUbicacion || u.id_ubicacion || '-';
            const edificio = u.edificio || '-';
            const piso = u.piso || '-';
            const sala = u.sala || '-';

            tbody.append(`
                <tr>
                    <td>${idUbicacion}</td>
                    <td>${edificio}</td>
                    <td>${piso}</td>
                    <td>${sala}</td>
                    <td>${descripcion}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarUbicacion(${idUbicacion})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUbicacion(${idUbicacion})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    setTimeout(function() {
        try {
            ubicacionesTable = $('#tablaUbicaciones').DataTable({
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

function filtrarTabla() {
    const textoBusqueda = $('#buscarUbicacion').val().toLowerCase();
    const filtroEdificio = $('#filtroEdificio').val();

    if (!ubicacionesTable) return;

    const data = ubicacionesTable.rows().data();
    const ubicacionesFiltradas = [];

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const coincideTexto = !textoBusqueda ||
            row.edificio?.toLowerCase().includes(textoBusqueda) ||
            row.piso?.toLowerCase().includes(textoBusqueda) ||
            row.sala?.toLowerCase().includes(textoBusqueda) ||
            row.descripcion?.toLowerCase().includes(textoBusqueda);
        const coincideEdificio = filtroEdificio === 'todos' || row.edificio === filtroEdificio;

        if (coincideTexto && coincideEdificio) {
            ubicacionesFiltradas.push(row);
        }
    }

    mostrarTabla(ubicacionesFiltradas);
}

async function guardarUbicacion() {
    const id = $('#ubicacionId').val();
    const edificio = $('#edificio').val().trim();
    const piso = $('#piso').val().trim();
    const sala = $('#sala').val().trim();
    const descripcion = $('#descripcion').val().trim();

    if (!edificio || !piso || !sala) {
        showError('Los campos Edificio, Piso y Sala son obligatorios');
        return;
    }

    const ubicacionData = {
        edificio: edificio,
        piso: piso,
        sala: sala,
        descripcion: descripcion || ''
    };
    if (id) ubicacionData.idUbicacion = parseInt(id);

    try {
        const token = localStorage.getItem('token');
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/pcgestor/api/ubicaciones/${id}` : '/pcgestor/api/ubicaciones';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ubicacionData)
        });

        if (!response.ok) {
            const text = await response.text();
            let errorMsg = 'Error al guardar';
            try {
                const error = JSON.parse(text);
                errorMsg = error.error || error.message || errorMsg;
            } catch (e) {
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }

        showSuccess(id ? 'Ubicación actualizada' : 'Ubicación registrada');
        $('#modalUbicacion').modal('hide');
        cargarUbicaciones();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al guardar la ubicación');
    }
}

function editarUbicacion(id) {
    const row = $(`#tablaUbicaciones tbody tr`).filter(function() {
        return $(this).find('td:first').text() == id;
    });

    if (row.length > 0) {
        const celdas = row.find('td');
        const edificio = celdas.eq(1).text().trim();
        const piso = celdas.eq(2).text().trim();
        const sala = celdas.eq(3).text().trim();
        const descripcion = celdas.eq(4).text().trim() === '-' ? '' : celdas.eq(4).text().trim();

        $('#ubicacionId').val(id);
        $('#edificio').val(edificio);
        $('#piso').val(piso);
        $('#sala').val(sala);
        $('#descripcion').val(descripcion);

        $('.modal-title').text('Editar ubicación');
        $('#modalUbicacion').modal('show');
    } else {
        cargarUbicacionDesdeAPI(id);
    }
}

async function cargarUbicacionDesdeAPI(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pcgestor/api/ubicaciones/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar la ubicación');

        const ubicacion = await response.json();

        $('#ubicacionId').val(ubicacion.idUbicacion || ubicacion.id_ubicacion);
        $('#edificio').val(ubicacion.edificio || '');
        $('#piso').val(ubicacion.piso || '');
        $('#sala').val(ubicacion.sala || '');
        $('#descripcion').val(ubicacion.descripcion || '');

        $('.modal-title').text('Editar ubicación');
        $('#modalUbicacion').modal('show');
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar la ubicación para editar');
    }
}

function eliminarUbicacion(id) {
    showConfirm('¿Está seguro de eliminar esta ubicación?', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/pcgestor/api/ubicaciones/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMsg = 'Error al eliminar';
                try {
                    const error = JSON.parse(text);
                    errorMsg = error.error || error.message || errorMsg;
                } catch (e) {
                    if (text) errorMsg = text;
                }
                throw new Error(errorMsg);
            }

            showSuccess('Ubicación eliminada correctamente');
            cargarUbicaciones();
        } catch (error) {
            console.error('Error al eliminar ubicación:', error);
            showError(error.message || 'Error al eliminar la ubicación');
        }
    });
}

// Funciones auxiliares (deben existir en main.js)
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
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}