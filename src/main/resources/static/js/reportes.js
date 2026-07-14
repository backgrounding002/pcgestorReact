// reportes.js - Lógica del módulo de reportes

let tablaReportes;

const datosEjemplo = {
    equipos: [
        { id: 1, marca: 'HP', modelo: 'Pavilion', serial: 'HP001', estado: 'Activo', ubicacion: 'Oficina 101' },
        { id: 2, marca: 'Dell', modelo: 'Latitude', serial: 'DEL002', estado: 'Activo', ubicacion: 'Oficina 102' },
        { id: 3, marca: 'Samsung', modelo: 'Monitor', serial: 'SAM003', estado: 'En mantenimiento', ubicacion: 'Bodega' }
    ],
    asignaciones: [
        { id: 1, fecha: '2024-01-01', equipo: 'Laptop HP', usuario: 'Ana Pérez', motivo: 'Desarrollo' },
        { id: 2, fecha: '2024-02-15', equipo: 'Escritorio Dell', usuario: 'Carlos Gómez', motivo: 'Administración' }
    ],
    mantenimientos: [
        { id: 1, fecha: '2024-01-10', tipo: 'Preventivo', equipo: 'Laptop HP', costo: 50000 },
        { id: 2, fecha: '2024-02-20', tipo: 'Correctivo', equipo: 'Escritorio Dell', costo: 120000 }
    ],
    usuarios: [
        { id: 1, nombre: 'Federico', correo: 'fedro@example.com', rol: 'Administrador', estado: 'Activo' },
        { id: 2, nombre: 'Laura', correo: 'laura@example.com', rol: 'Empleado', estado: 'Activo' }
    ]
};

$(document).ready(function() {
    cargarResumenes();
    generarReporte();

    $('#btnGenerarReporte').on('click', generarReporte);
    $('#btnExportarExcel').on('click', exportarAExcel);
});

function cargarResumenes() {
    $('#totalEquipos').text(datosEjemplo.equipos.length);
    $('#totalAsignaciones').text(datosEjemplo.asignaciones.length);
    $('#totalMantenimientos').text(datosEjemplo.mantenimientos.length);
    $('#totalUsuarios').text(datosEjemplo.usuarios.length);
}

function generarReporte() {
    const tipo = $('#tipoReporte').val();
    const fechaInicio = $('#fechaInicio').val();
    const fechaFin = $('#fechaFin').val();

    let datos = [];
    let encabezados = [];

    switch(tipo) {
        case 'equipos':
            datos = datosEjemplo.equipos;
            encabezados = ['ID', 'Marca', 'Modelo', 'Serial', 'Estado', 'Ubicación'];
            break;
        case 'asignaciones':
            datos = datosEjemplo.asignaciones;
            encabezadados = ['ID', 'Fecha', 'Equipo', 'Usuario', 'Motivo'];
            break;
        case 'mantenimientos':
            datos = datosEjemplo.mantenimientos;
            encabezados = ['ID', 'Fecha', 'Tipo', 'Equipo', 'Costo'];
            break;
        case 'usuarios':
            datos = datosEjemplo.usuarios;
            encabezados = ['ID', 'Nombre', 'Correo', 'Rol', 'Estado'];
            break;
    }

    if (fechaInicio || fechaFin) {
        datos = filtrarPorFecha(datos, fechaInicio, fechaFin);
    }

    mostrarTabla(datos, encabezados, tipo);
}

function filtrarPorFecha(datos, fechaInicio, fechaFin) {
    if (!fechaInicio && !fechaFin) return datos;

    return datos.filter(item => {
        if (!item.fecha) return true;
        const fechaItem = new Date(item.fecha);
        const desde = fechaInicio ? new Date(fechaInicio) : null;
        const hasta = fechaFin ? new Date(fechaFin) : null;

        if (desde && hasta) return fechaItem >= desde && fechaItem <= hasta;
        if (desde) return fechaItem >= desde;
        if (hasta) return fechaItem <= hasta;
        return true;
    });
}

function mostrarTabla(datos, encabezados, tipo) {
    if (tablaReportes) tablaReportes.destroy();

    const thead = $('#encabezadoTabla');
    thead.empty();
    encabezados.forEach(col => thead.append(`<th>${col}</th>`));

    const tbody = $('#tablaReportes tbody');
    tbody.empty();

    datos.forEach(item => {
        let fila = '';
        switch(tipo) {
            case 'equipos':
                fila = `<tr>
                            <td>${item.id}</td>
                            <td>${item.marca}</td>
                            <td>${item.modelo}</td>
                            <td>${item.serial}</td>
                            <td><span class="badge ${item.estado === 'Activo' ? 'bg-success' : 'bg-warning'}">${item.estado}</span></td>
                            <td>${item.ubicacion}</td>
                        </tr>`;
                break;
            case 'asignaciones':
                fila = `<tr>
                            <td>${item.id}</td>
                            <td>${formatDate(item.fecha)}</td>
                            <td>${item.equipo}</td>
                            <td>${item.usuario}</td>
                            <td>${item.motivo || '-'}</td>
                        </tr>`;
                break;
            case 'mantenimientos':
                fila = `<tr>
                            <td>${item.id}</td>
                            <td>${formatDate(item.fecha)}</td>
                            <td>${item.tipo}</td>
                            <td>${item.equipo}</td>
                            <td>${formatCurrency(item.costo)}</td>
                        </tr>`;
                break;
            case 'usuarios':
                fila = `<tr>
                            <td>${item.id}</td>
                            <td>${item.nombre}</td>
                            <td>${item.correo}</td>
                            <td><span class="badge bg-info">${item.rol}</span></td>
                            <td><span class="badge bg-success">${item.estado}</span></td>
                        </tr>`;
                break;
        }
        tbody.append(fila);
    });

    if (datos.length === 0) {
        tbody.append(`<tr><td colspan="${encabezados.length}" class="text-center">No hay datos disponibles</td></tr>`);
    }

    tablaReportes = $('#tablaReportes').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        order: [[0, 'desc']],
        pageLength: 10
    });
}

function exportarAExcel() {
    const tipo = $('#tipoReporte').val();
    let datos = [];
    let nombreArchivo = 'reporte_';

    switch(tipo) {
        case 'equipos':
            datos = datosEjemplo.equipos;
            nombreArchivo += 'equipos';
            break;
        case 'asignaciones':
            datos = datosEjemplo.asignaciones;
            nombreArchivo += 'asignaciones';
            break;
        case 'mantenimientos':
            datos = datosEjemplo.mantenimientos;
            nombreArchivo += 'mantenimientos';
            break;
        case 'usuarios':
            datos = datosEjemplo.usuarios;
            nombreArchivo += 'usuarios';
            break;
    }

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showSuccess('Reporte exportado correctamente');
}