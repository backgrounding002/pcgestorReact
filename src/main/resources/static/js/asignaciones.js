let asignacionesTable;
const datosEjemplo = [
    { id: 1, fecha: '2024-01-01', equipo: 'Laptop HP', empleado: 'Ana Pérez' },
    { id: 2, fecha: '2024-02-15', equipo: 'Escritorio Dell', empleado: 'Carlos Gómez' },
    { id: 3, fecha: '2024-03-25', equipo: 'Monitor Samsung', empleado: 'Laura Rodríguez' },
    { id: 4, fecha: '2024-04-30', equipo: 'Laptop Lenovo', empleado: 'Javier Martínez' }
];
$(document).ready(function() {
    cargarAsignaciones();
});
function cargarAsignaciones() {
    if (asignacionesTable) asignacionesTable.destroy();
    const tbody = $('#tablaAsignaciones tbody');
    tbody.empty();
    datosEjemplo.forEach(a => {
        tbody.append(`<tr><td>${a.id}</td><td>${formatDate(a.fecha)}</td><td>${a.equipo}</td><td>${a.empleado}</td><td><button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button></td></tr>`);
    });
    asignacionesTable = $('#tablaAsignaciones').DataTable({ language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' } });
}