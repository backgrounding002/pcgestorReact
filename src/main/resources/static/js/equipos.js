let equiposTable;

$(document).ready(function() {
    cargarEquipos();
    
    $('#modalEquipo').on('hidden.bs.modal', function() {
        $('#formEquipo')[0].reset();
        $('#equipoId').val('');
        $('.modal-title').text('Registrar equipo');
    });
});

async function cargarEquipos() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pcgestor/api/equipos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar equipos');
        const equipos = await response.json();
        mostrarTabla(equipos);
    } catch (error) {
        console.error(error);
        // Datos de ejemplo si falla la API
        const equiposEjemplo = [
            { id: 1, marca: 'HP', modelo: 'Pavilion', serial: 'HP001', estado: 'Activo', ubicacion: 'Oficina 101' },
            { id: 2, marca: 'Dell', modelo: 'Latitude', serial: 'DEL002', estado: 'Activo', ubicacion: 'Oficina 102' },
            { id: 3, marca: 'Samsung', modelo: 'Monitor', serial: 'SAM003', estado: 'Activo', ubicacion: 'Bodega' }
        ];
        mostrarTabla(equiposEjemplo);
    }
}

function mostrarTabla(equipos) {
    if (equiposTable) equiposTable.destroy();
    const tbody = $('#tablaEquipos tbody');
    tbody.empty();
    equipos.forEach(eq => {
        let badgeClass = 'bg-secondary';
        if (eq.estado === 'Activo') badgeClass = 'bg-success';
        else if (eq.estado === 'En mantenimiento') badgeClass = 'bg-warning';
        else if (eq.estado === 'Dado de baja') badgeClass = 'bg-danger';
        
        tbody.append(`
            <tr>
                <td>${eq.id}</td>
                <td>${eq.marca}</td>
                <td>${eq.modelo}</td>
                <td>${eq.serial}</td>
                <td><span class="badge ${badgeClass}">${eq.estado}</span></td>
                <td>${eq.ubicacion || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarEquipo(${eq.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEquipo(${eq.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `);
    });
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
        }
    });
}

function guardarEquipo() {
    const marca = $('#marca').val().trim();
    const modelo = $('#modelo').val().trim();
    const serial = $('#serial').val().trim();
    
    if (!marca || !modelo || !serial) {
        showError('Los campos Marca, Modelo y Serial son obligatorios');
        return;
    }
    
    const id = $('#equipoId').val();
    const equipo = {
        marca: marca,
        modelo: modelo,
        serial: serial,
        estado: $('#estado').val(),
        ubicacion: $('#ubicacion').val().trim()
    };
    if (id) equipo.id = parseInt(id);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/pcgestor/api/equipos/${id}` : '/pcgestor/api/equipos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(equipo)
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                let errorMsg = 'Error al guardar';
                try {
                    const data = JSON.parse(text);
                    if (data.message) errorMsg = data.message;
                    if (data.error) errorMsg = data.error;
                } catch (e) {
                    if (text && text.length > 0) errorMsg = text;
                }
                throw new Error(errorMsg);
            });
        }
        return res.json();
    })
    .then(data => {
        showSuccess(id ? 'Equipo actualizado' : 'Equipo registrado');
        $('#modalEquipo').modal('hide');
        cargarEquipos();
    })
    .catch(err => {
        console.error(err);
        showError(err.message || 'Error al guardar');
    });
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
        const estado = celdas.eq(4).text().trim();
        const ubicacion = celdas.eq(5).text().trim() === '-' ? '' : celdas.eq(5).text().trim();
        
        $('#equipoId').val(id);
        $('#marca').val(marca);
        $('#modelo').val(modelo);
        $('#serial').val(serial);
        $('#estado').val(estado);
        $('#ubicacion').val(ubicacion);
        
        $('.modal-title').text('Editar equipo');
        $('#modalEquipo').modal('show');
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
        
        $('#equipoId').val(equipo.id);
        $('#marca').val(equipo.marca);
        $('#modelo').val(equipo.modelo);
        $('#serial').val(equipo.serial);
        $('#estado').val(equipo.estado);
        $('#ubicacion').val(equipo.ubicacion || '');
        
        $('.modal-title').text('Editar equipo');
        $('#modalEquipo').modal('show');
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar el equipo para editar');
    }
}

function eliminarEquipo(id) {
    showConfirm('¿Está seguro de eliminar este equipo?', () => {
        const token = localStorage.getItem('token');
        
        fetch(`/pcgestor/api/equipos/${id}`, { 
            method: 'DELETE', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        })
        .then(response => {
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.log('Error response body:', text);
                    let errorMsg = `Error ${response.status}: ${response.statusText}`;
                    try {
                        const data = JSON.parse(text);
                        if (data.message) errorMsg = data.message;
                        if (data.error) errorMsg = data.error;
                    } catch (e) {
                        if (text && text.length > 0) {
                            errorMsg = text;
                        }
                    }
                    throw new Error(errorMsg);
                });
            }
            
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) > 0) {
                return response.text().then(text => {
                    console.log('Response body:', text);
                    try {
                        const data = JSON.parse(text);
                        return { success: true, data };
                    } catch (e) {
                        return { success: true, raw: text };
                    }
                });
            } else {
                return { success: true };
            }
        })
        .then(result => {
            showSuccess('Equipo eliminado correctamente');
            cargarEquipos();
        })
        .catch(error => {
            console.error('Error al eliminar equipo:', error);
            showError(error.message || 'Error al eliminar el equipo');
        });
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
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}