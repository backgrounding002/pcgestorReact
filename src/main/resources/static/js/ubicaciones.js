// ubicaciones.js - Gestión de ubicaciones

let ubicacionesTable;
let listaUbicaciones = [
    { id: 1, nombre: 'Oficina 101', edificio: 'Edificio A', sala: '101', capacidad: 10 },
    { id: 2, nombre: 'Oficina 102', edificio: 'Edificio A', sala: '102', capacidad: 8 },
    { id: 3, nombre: 'Bodega principal', edificio: 'Edificio B', sala: '1', capacidad: 20 },
    { id: 4, nombre: 'Sala de reuniones', edificio: 'Edificio B', sala: '202', capacidad: 15 },
    { id: 5, nombre: 'Taller de soporte', edificio: 'Edificio C', sala: '303', capacidad: 5 }
];

$(document).ready(function() {
    cargarTablaUbicaciones();

    $('#buscarUbicacion').on('keyup', filtrarTabla);
    $('#filtroEdificio').on('change', filtrarTabla);
    $('#btnRecargar').on('click', function() {
        $('#buscarUbicacion').val('');
        $('#filtroEdificio').val('todos');
        cargarTablaUbicaciones();
    });

    $('#modalUbicacion').on('hidden.bs.modal', function() {
        $('#formUbicacion')[0].reset();
        $('#ubicacionId').val('');
        $('.modal-title').text('Nueva ubicación');
    });
});

function cargarTablaUbicaciones() {
    if (ubicacionesTable) ubicacionesTable.destroy();
    mostrarUbicaciones(listaUbicaciones);
}

function mostrarUbicaciones(ubicaciones) {
    const tbody = $('#tablaUbicaciones tbody');
    tbody.empty();

    ubicaciones.forEach(u => {
        tbody.append(`
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.edificio}</td>
                <td>${u.sala}</td>
                <td>${u.capacidad}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarUbicacion(${u.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUbicacion(${u.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });

    if (ubicaciones.length === 0) {
        tbody.append(`<tr><td colspan="6" class="text-center">No hay ubicaciones registradas</td></tr>`);
    }

    ubicacionesTable = $('#tablaUbicaciones').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        order: [[0, 'desc']],
        pageLength: 10,
        destroy: true
    });
}

function filtrarTabla() {
    const texto = $('#buscarUbicacion').val().toLowerCase();
    const edificio = $('#filtroEdificio').val();

    const filtradas = listaUbicaciones.filter(u => {
        const coincideTexto = !texto || 
            u.nombre.toLowerCase().includes(texto) || 
            u.edificio.toLowerCase().includes(texto) || 
            u.sala.includes(texto);
        const coincideEdificio = edificio === 'todos' || u.edificio === edificio;
        return coincideTexto && coincideEdificio;
    });

    mostrarUbicaciones(filtradas);
}

function guardarUbicacion() {
    const id = $('#ubicacionId').val();
    const ubicacion = {
        nombre: $('#nombre').val().trim(),
        edificio: $('#edificio').val(),
        sala: $('#sala').val().trim(),
        capacidad: $('#capacidad').val() || 10
    };

    if (!ubicacion.nombre || !ubicacion.edificio || !ubicacion.sala) {
        showError('Por favor complete todos los campos obligatorios');
        return;
    }

    if (id) {
        const index = listaUbicaciones.findIndex(u => u.id == id);
        if (index !== -1) {
            listaUbicaciones[index] = { ...listaUbicaciones[index], ...ubicacion };
            showSuccess('Ubicación actualizada correctamente');
        }
    } else {
        const nuevoId = listaUbicaciones.length ? Math.max(...listaUbicaciones.map(u => u.id)) + 1 : 6;
        listaUbicaciones.push({ id: nuevoId, ...ubicacion });
        showSuccess('Ubicación registrada correctamente');
    }

    $('#modalUbicacion').modal('hide');
    cargarTablaUbicaciones();
}

function editarUbicacion(id) {
    const ubicacion = listaUbicaciones.find(u => u.id == id);
    if (!ubicacion) return;

    $('#ubicacionId').val(ubicacion.id);
    $('#nombre').val(ubicacion.nombre);
    $('#edificio').val(ubicacion.edificio);
    $('#sala').val(ubicacion.sala);
    $('#capacidad').val(ubicacion.capacidad);
    $('.modal-title').text('Editar ubicación');
    $('#modalUbicacion').modal('show');
}

function eliminarUbicacion(id) {
    const ubicacion = listaUbicaciones.find(u => u.id == id);
    showConfirm(`¿Está seguro de eliminar la ubicación "${ubicacion.nombre}"?`, () => {
        listaUbicaciones = listaUbicaciones.filter(u => u.id != id);
        showSuccess('Ubicación eliminada correctamente');
        cargarTablaUbicaciones();
    });
}