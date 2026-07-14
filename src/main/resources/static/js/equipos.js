let equiposTable;

$(document).ready(function() {
    cargarEquipos();
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
        tbody.append(`
            <tr>
                <td>${eq.id}</td>
                <td>${eq.marca}</td>
                <td>${eq.modelo}</td>
                <td>${eq.serial}</td>
                <td><span class="badge ${eq.estado === 'Activo' ? 'bg-success' : 'bg-warning'}">${eq.estado}</span></td>
                <td>${eq.ubicacion || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarEquipo(${eq.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEquipo(${eq.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `);
    });
    equiposTable = $('#tablaEquipos').DataTable({ language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' } });
}

function guardarEquipo() {
    const id = $('#equipoId').val();
    const equipo = {
        marca: $('#marca').val(),
        modelo: $('#modelo').val(),
        serial: $('#serial').val(),
        estado: $('#estado').val(),
        ubicacion: $('#ubicacion').val()
    };
    if (id) equipo.id = id;

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
    .then(res => res.json())
    .then(data => {
        showSuccess(id ? 'Equipo actualizado' : 'Equipo registrado');
        $('#modalEquipo').modal('hide');
        cargarEquipos();
    })
    .catch(err => {
        console.error(err);
        showError('Error al guardar');
    });
}

function editarEquipo(id) {
    // Cargar datos del equipo (simulado)
    showError('Funcionalidad en desarrollo');
}

function eliminarEquipo(id) {
    showConfirm('¿Eliminar equipo?', () => {
        fetch(`/pcgestor/api/equipos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(() => { showSuccess('Equipo eliminado'); cargarEquipos(); })
        .catch(() => showError('Error'));
    });
}