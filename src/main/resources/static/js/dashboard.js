// dashboard.js - Carga datos reales desde el backend

$(document).ready(async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8086/pcgestor/api/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        if (response.status === 403) {
            console.error('Sin permisos para ver el dashboard');
            pintarVacios();
            return;
        }

        if (!response.ok) throw new Error('Error ' + response.status);

        const data = await response.json();

        // Tarjetas superiores con datos reales de la BD
        $('#totalEquipos').text(data.equiposActivos || 0);
        $('#equiposDisponibles').text(data.equiposDisponibles || 0);
        $('#mantenimientosPendientes').text(data.mantenimientosPendientes || 0);
        $('#totalAsignaciones').text(data.asignacionesActivas || 0);

        // Gráfico donut
        dibujarGrafico(data.equiposPorEstado || []);

        // Tabla de asignaciones recientes
        dibujarTablaAsignaciones(data.asignacionesRecientes || []);

    } catch (error) {
        console.error('Error cargando dashboard:', error);
        pintarVacios();
    }
});

function pintarVacios() {
    $('#totalEquipos').text('0');
    $('#equiposDisponibles').text('0');
    $('#mantenimientosPendientes').text('0');
    $('#totalAsignaciones').text('0');
    dibujarGrafico([]);
    dibujarTablaAsignaciones([]);
}

function dibujarGrafico(equiposPorEstado) {
    const canvas = document.getElementById('chartEstadoEquipos');
    if (!canvas) return;

    // Destruir instancia previa si existe
    if (window._chartEstado instanceof Chart) {
        window._chartEstado.destroy();
    }

    const coloresEstado = {
        'Activo':      '#2ecc71',
        'Disponible':  '#2ecc71',
        'En Uso':      '#3498db',
        'En Mantenimiento': '#f39c12',
        'Dañado':      '#e74c3c',
        'Retirado':    '#95a5a6'
    };

    const labels = equiposPorEstado.map(e => e.estado);
    const valores = equiposPorEstado.map(e => e.cantidad);
    const colores = labels.map(l => coloresEstado[l] || '#95a5a6');

    const dataFinal = (labels.length > 0)
        ? { labels, datasets: [{ data: valores, backgroundColor: colores, borderWidth: 0 }] }
        : { labels: ['Sin datos'], datasets: [{ data: [1], backgroundColor: ['#dee2e6'], borderWidth: 0 }] };

    window._chartEstado = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: dataFinal,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function dibujarTablaAsignaciones(asignaciones) {
    const tbody = $('#tablaAsignacionesRecientes tbody');
    tbody.empty();

    if (!asignaciones || asignaciones.length === 0) {
        tbody.append('<tr><td colspan="3" class="text-center text-muted">No hay asignaciones recientes</td></tr>');
        return;
    }

    asignaciones.forEach(function(a) {
        const fecha = a.fecha ? formatearFecha(a.fecha) : '-';
        const equipo = a.equipo || '-';
        const usuario = a.usuario || '-';
        tbody.append(
            '<tr>' +
                '<td>' + fecha + '</td>' +
                '<td>' + equipo + '</td>' +
                '<td>' + usuario + '</td>' +
            '</tr>'
        );
    });
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return '-';
    // Acepta "2026-07-30" o "2026-07-30T00:00:00"
    const soloFecha = String(fechaStr).substring(0, 10);
    const partes = soloFecha.split('-');
    if (partes.length !== 3) return fechaStr;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}