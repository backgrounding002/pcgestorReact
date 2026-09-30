// reportes.js - Módulo de reportes con datos reales del backend

const API_URL = 'http://localhost:8086/pcgestor/api';

let tablaReportes = null;
let tipoActual = 'equipos';

function getToken() {
    return localStorage.getItem('token');
}

$(document).ready(function() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    cargarEstadisticas();
    generarReporte();

    $('#btnGenerarReporte').on('click', generarReporte);
    $('#btnExportarExcel').on('click', exportarAExcel);
});

// ================================================
// Tarjetas superiores con contadores reales
// ================================================
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/reportes/estadisticas`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Error ' + response.status);

        const stats = await response.json();
        $('#totalEquipos').text(stats.totalEquipos || 0);
        $('#totalAsignaciones').text(stats.totalAsignaciones || 0);
        $('#totalMantenimientos').text(stats.totalMantenimientos || 0);
        $('#totalUsuarios').text(stats.usuariosActivos || 0);

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        $('#totalEquipos').text('0');
        $('#totalAsignaciones').text('0');
        $('#totalMantenimientos').text('0');
        $('#totalUsuarios').text('0');
    }
}

// ================================================
// Cargar datos según tipo de reporte
// ================================================
async function generarReporte() {
    tipoActual = $('#tipoReporte').val();
    const fechaInicio = $('#fechaInicio').val();
    const fechaFin = $('#fechaFin').val();

    let endpoint = '';
    switch (tipoActual) {
        case 'equipos':         endpoint = '/equipos';        break;
        case 'asignaciones':    endpoint = '/asignaciones';   break;
        case 'mantenimientos':  endpoint = '/mantenimientos'; break;
        case 'usuarios':        endpoint = '/usuarios';       break;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        if (response.status === 403) {
            mostrarMensaje('No tienes permisos para consultar este tipo de reporte', 'error');
            renderizarTabla([], tipoActual);
            return;
        }

        if (!response.ok) throw new Error('Error ' + response.status);

        let datos = await response.json();

        // Filtrado por fecha (solo aplica a asignaciones y mantenimientos)
        if ((fechaInicio || fechaFin) && (tipoActual === 'asignaciones' || tipoActual === 'mantenimientos')) {
            datos = filtrarPorFecha(datos, fechaInicio, fechaFin, tipoActual);
        }

        renderizarTabla(datos, tipoActual);

    } catch (error) {
        console.error('Error generando reporte:', error);
        mostrarMensaje('Error al cargar el reporte', 'error');
        renderizarTabla([], tipoActual);
    }
}

function filtrarPorFecha(datos, fechaInicio, fechaFin, tipo) {
    return datos.filter(function(item) {
        const fechaItem = (tipo === 'asignaciones') ? item.fechaAsignacion : item.fecha;
        if (!fechaItem) return true;

        const fecha = new Date(fechaItem);
        const desde = fechaInicio ? new Date(fechaInicio) : null;
        const hasta = fechaFin ? new Date(fechaFin) : null;

        if (desde && hasta) return fecha >= desde && fecha <= hasta;
        if (desde) return fecha >= desde;
        if (hasta) return fecha <= hasta;
        return true;
    });
}

// ================================================
// Render de tabla según tipo
// ================================================
function renderizarTabla(datos, tipo) {
    if (tablaReportes) {
        tablaReportes.destroy();
        tablaReportes = null;
    }

    const thead = $('#encabezadoTabla');
    const tbody = $('#tablaReportes tbody');
    thead.empty();
    tbody.empty();

    let encabezados = [];

    switch (tipo) {

        case 'equipos':
            encabezados = ['ID', 'Marca', 'Modelo', 'Serial', 'Estado', 'Ubicación'];
            thead.append(encabezados.map(h => '<th>' + h + '</th>').join(''));

            if (datos.length === 0) {
                tbody.append('<tr><td colspan="' + encabezados.length + '" class="text-center text-muted">No hay datos</td></tr>');
            } else {
                datos.forEach(function(e) {
                    const estado = e.estado ? e.estado.nombre : '-';
                    const ubicacion = e.ubicacion
                        ? (e.ubicacion.edificio || '') + ' ' + (e.ubicacion.sala || '')
                        : '-';
                    tbody.append(
                        '<tr>' +
                            '<td>' + (e.id || '') + '</td>' +
                            '<td>' + (e.marca || '-') + '</td>' +
                            '<td>' + (e.modelo || '-') + '</td>' +
                            '<td>' + (e.serial || '-') + '</td>' +
                            '<td><span class="badge ' + badgeEstado(estado) + '">' + estado + '</span></td>' +
                            '<td>' + ubicacion.trim() + '</td>' +
                        '</tr>'
                    );
                });
            }
            break;

        case 'asignaciones':
            encabezados = ['ID', 'Fecha', 'Equipo', 'Usuario', 'Motivo', 'Activa'];
            thead.append(encabezados.map(h => '<th>' + h + '</th>').join(''));

            if (datos.length === 0) {
                tbody.append('<tr><td colspan="' + encabezados.length + '" class="text-center text-muted">No hay datos</td></tr>');
            } else {
                datos.forEach(function(a) {
                    const equipo = a.equipo
                        ? ((a.equipo.marca || '') + ' ' + (a.equipo.modelo || '')).trim()
                        : '-';
                    const usuario = a.usuario ? a.usuario.username : '-';
                    const activa = a.activa ? 'Sí' : 'No';
                    tbody.append(
                        '<tr>' +
                            '<td>' + (a.idAsignacion || '') + '</td>' +
                            '<td>' + formatearFecha(a.fechaAsignacion) + '</td>' +
                            '<td>' + equipo + '</td>' +
                            '<td>' + usuario + '</td>' +
                            '<td>' + (a.motivo || '-') + '</td>' +
                            '<td><span class="badge ' + (a.activa ? 'bg-success' : 'bg-secondary') + '">' + activa + '</span></td>' +
                        '</tr>'
                    );
                });
            }
            break;

        case 'mantenimientos':
            encabezados = ['ID', 'Fecha', 'Tipo', 'Equipo', 'Descripción', 'Costo'];
            thead.append(encabezados.map(h => '<th>' + h + '</th>').join(''));

            if (datos.length === 0) {
                tbody.append('<tr><td colspan="' + encabezados.length + '" class="text-center text-muted">No hay datos</td></tr>');
            } else {
                datos.forEach(function(m) {
                    const equipo = m.equipo
                        ? ((m.equipo.marca || '') + ' ' + (m.equipo.modelo || '')).trim()
                        : '-';
                    tbody.append(
                        '<tr>' +
                            '<td>' + (m.idMantenimiento || '') + '</td>' +
                            '<td>' + formatearFecha(m.fecha) + '</td>' +
                            '<td>' + (m.tipo || '-') + '</td>' +
                            '<td>' + equipo + '</td>' +
                            '<td>' + (m.descripcion || '-') + '</td>' +
                            '<td>' + formatearMoneda(m.costo) + '</td>' +
                        '</tr>'
                    );
                });
            }
            break;

        case 'usuarios':
            encabezados = ['ID', 'Usuario', 'Rol', 'Estado'];
            thead.append(encabezados.map(h => '<th>' + h + '</th>').join(''));

            if (datos.length === 0) {
                tbody.append('<tr><td colspan="' + encabezados.length + '" class="text-center text-muted">No hay datos</td></tr>');
            } else {
                datos.forEach(function(u) {
                    const activo = (u.activo === 1) ? 'bg-success' : 'bg-secondary';
                    tbody.append(
                        '<tr>' +
                            '<td>' + (u.id || '') + '</td>' +
                            '<td>' + (u.username || '-') + '</td>' +
                            '<td>' + (u.role || '-') + '</td>' +
                            '<td><span class="badge ' + activo + '">' + (u.estado || '-') + '</span></td>' +
                        '</tr>'
                    );
                });
            }
            break;
    }

    tablaReportes = $('#tablaReportes').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        order: [[0, 'desc']],
        pageLength: 10,
        destroy: true
    });
}

function badgeEstado(estado) {
    switch (estado) {
        case 'Activo':
        case 'Disponible':       return 'bg-success';
        case 'En Uso':           return 'bg-primary';
        case 'En Mantenimiento': return 'bg-warning text-dark';
        case 'Dañado':           return 'bg-danger';
        case 'Retirado':         return 'bg-secondary';
        default:                 return 'bg-secondary';
    }
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return '-';
    const soloFecha = String(fechaStr).substring(0, 10);
    const partes = soloFecha.split('-');
    if (partes.length !== 3) return fechaStr;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function formatearMoneda(valor) {
    if (valor === null || valor === undefined) return '-';
    const numero = Number(valor);
    if (isNaN(numero)) return valor;
    return '$' + numero.toLocaleString('es-CO');
}

function mostrarMensaje(texto, tipo) {
    if (typeof showSuccess === 'function' && tipo === 'success') {
        showSuccess(texto);
        return;
    }
    if (typeof showError === 'function' && tipo === 'error') {
        showError(texto);
        return;
    }
    if (window.Swal) {
        Swal.fire({
            icon: tipo === 'error' ? 'error' : 'success',
            text: texto,
            timer: 2500,
            showConfirmButton: false
        });
    } else {
        alert(texto);
    }
}

// ================================================
// Exportar a Excel (descarga desde el backend)
// ================================================
async function exportarAExcel() {
    const tipo = $('#tipoReporte').val();

    let endpoint = '';
    let nombreArchivo = '';

    switch (tipo) {
        case 'equipos':
            endpoint = '/reportes/export/equipos/excel';
            nombreArchivo = 'equipos.xlsx';
            break;
        case 'asignaciones':
            endpoint = '/reportes/export/asignaciones/excel';
            nombreArchivo = 'asignaciones.xlsx';
            break;
        case 'mantenimientos':
            endpoint = '/reportes/export/mantenimientos/excel';
            nombreArchivo = 'mantenimientos.xlsx';
            break;
        case 'usuarios':
            endpoint = '/reportes/export/usuarios/excel';
            nombreArchivo = 'usuarios.xlsx';
            break;
        default:
            mostrarMensaje('Tipo de reporte no soportado', 'error');
            return;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        if (response.status === 403) {
            mostrarMensaje('No tienes permisos para exportar este reporte', 'error');
            return;
        }

        if (!response.ok) throw new Error('Error ' + response.status);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        mostrarMensaje('Reporte exportado correctamente', 'success');

    } catch (error) {
        console.error('Error exportando:', error);
        mostrarMensaje('Error al exportar el reporte', 'error');
    }
}