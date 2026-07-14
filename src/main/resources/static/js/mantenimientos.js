// asignaciones.js - Gestión de asignaciones (simulado con datos locales)

let asignacionesTable;
let datosAsignaciones = [
    { id: 1, fecha: '2024-01-01', equipo: 'Laptop HP', empleado: 'Ana Pérez', motivo: 'Desarrollo' },
    { id: 2, fecha: '2024-02-15', equipo: 'Escritorio Dell', empleado: 'Carlos Gómez', motivo: 'Administración' },
    { id: 3, fecha: '2024-03-25', equipo: 'Monitor Samsung', empleado: 'Laura Rodríguez', motivo: 'Diseño' },
    { id: 4, fecha: '2024-04-30', equipo: 'Laptop Lenovo', empleado: 'Javier Martínez', motivo: 'Sistemas' }
];

// Cargar datos de equipos y usuarios para los selectores (simulados)
const equiposDisponibles = [
    { id: 1, nombre: 'Laptop HP - HP001' },
    { id: 2, nombre: 'Escritorio Dell - DEL002' },
    { id: 3, nombre: 'Monitor Samsung - SAM003' },
    { id: 4, nombre: 'Laptop Lenovo - LEN004' }
];

const usuariosDisponibles = [
    { id: 1, nombre: 'Ana Pérez' },
    { id: 2, nombre: 'Carlos Gómez' },
    { id: 3, nombre: 'Laura Rodríguez' },
    { id: 4, nombre: 'Javier Martínez' }
];

$(document).ready(function() {
    cargarAsignaciones();
    cargarSelectores();
});

function cargarAsignaciones() {
    if (asignacionesTable) asignacionesTable.destroy();
    const tbody = $('#tablaAsignaciones tbody');
    tbody.empty();
    
    datosAsignaciones.forEach(asig => {
        tbody.append(`
            <tr>
                <td>${asig.id}</td>
                <td>${formatDate(asig.fecha)}</td>
                <td>${asig.equipo}</td>
                <td>${asig.empleado}</td>
                <td>${asig.motivo || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarAsignacion(${asig.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarAsignacion(${asig.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    asignacionesTable = $('#tablaAsignaciones').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        order: [[1, 'desc']]
    });
}

function cargarSelectores() {
    const equipoSelect = $('#equipoId');
    equipoSelect.empty();
    equiposDisponibles.forEach(e => {
        equipoSelect.append(`<option value="${e.id}">${e.nombre}</option>`);
    });
    
    const usuarioSelect = $('#usuarioId');
    usuarioSelect.empty();
    usuariosDisponibles.forEach(u => {
        usuarioSelect.append(`<option value="${u.id}">${u.nombre}</option>`);
    });
}

function guardarAsignacion() {
    const id = $('#asignacionId').val();
    const equipoId = $('#equipoId').val();
    const usuarioId = $('#usuarioId').val();
    const fecha = $('#fechaAsignacion').val();
    const motivo = $('#motivo').val();
    
    if (!fecha || !equipoId || !usuarioId) {
        showError('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Obtener nombres para mostrar
    const equipoNombre = equiposDisponibles.find(e => e.id == equipoId)?.nombre || '';
    const empleadoNombre = usuariosDisponibles.find(u => u.id == usuarioId)?.nombre || '';
    
    if (id) {
        // Editar
        const index = datosAsignaciones.findIndex(a => a.id == id);
        if (index !== -1) {
            datosAsignaciones[index] = {
                ...datosAsignaciones[index],
                fecha: fecha,
                equipo: equipoNombre,
                empleado: empleadoNombre,
                motivo: motivo
            };
            showSuccess('Asignación actualizada correctamente');
        }
    } else {
        // Crear nuevo
        const nuevoId = datosAsignaciones.length ? Math.max(...datosAsignaciones.map(a => a.id)) + 1 : 5;
        datosAsignaciones.push({
            id: nuevoId,
            fecha: fecha,
            equipo: equipoNombre,
            empleado: empleadoNombre,
            motivo: motivo
        });
        showSuccess('Asignación registrada correctamente');
    }
    
    $('#modalAsignacion').modal('hide');
    $('#formAsignacion')[0].reset();
    $('#asignacionId').val('');
    cargarAsignaciones();
}

function editarAsignacion(id) {
    const asignacion = datosAsignaciones.find(a => a.id == id);
    if (!asignacion) return;
    
    $('#asignacionId').val(asignacion.id);
    $('#fechaAsignacion').val(asignacion.fecha);
    $('#motivo').val(asignacion.motivo || '');
    
    // Seleccionar opciones en los combos
    const equipoEncontrado = equiposDisponibles.find(e => e.nombre === asignacion.equipo);
    if (equipoEncontrado) $('#equipoId').val(equipoEncontrado.id);
    
    const usuarioEncontrado = usuariosDisponibles.find(u => u.nombre === asignacion.empleado);
    if (usuarioEncontrado) $('#usuarioId').val(usuarioEncontrado.id);
    
    $('#modalAsignacion').modal('show');
    $('.modal-title').text('Editar asignación');
}

function eliminarAsignacion(id) {
    showConfirm('¿Está seguro de eliminar esta asignación?', () => {
        datosAsignaciones = datosAsignaciones.filter(a => a.id != id);
        showSuccess('Asignación eliminada correctamente');
        cargarAsignaciones();
    });
}

// Al cerrar el modal, resetear título y formulario
$('#modalAsignacion').on('hidden.bs.modal', function() {
    $('#formAsignacion')[0].reset();
    $('#asignacionId').val('');
    $('.modal-title').text('Nueva asignación');
});