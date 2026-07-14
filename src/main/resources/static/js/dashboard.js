// dashboard.js - Carga de estadísticas y gráficos

$(document).ready(function() {
    cargarEstadisticas();
    cargarGrafico();
    cargarAsignacionesRecientes();
});

// Función para cargar datos de las tarjetas
async function cargarEstadisticas() {
    // Intentar obtener datos del backend (ajusta las URLs según tu API)
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pcgestor/api/estadisticas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            $('#totalEquipos').text(data.totalEquipos || 0);
            $('#equiposDisponibles').text(data.equiposDisponibles || 0);
            $('#mantenimientosPendientes').text(data.mantenimientosPendientes || 0);
            $('#totalAsignaciones').text(data.totalAsignaciones || 0);
            return;
        }
    } catch (error) {
        console.log('Usando datos de ejemplo para estadísticas');
    }
    
    // Datos de ejemplo (coinciden con el diseño proporcionado)
    $('#totalEquipos').text(146);
    $('#equiposDisponibles').text(89);
    $('#mantenimientosPendientes').text(32);
    $('#totalAsignaciones').text(25);
}

// Gráfico de equipos por estado
function cargarGrafico() {
    const ctx = document.getElementById('chartEstadoEquipos').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Activos', 'En mantenimiento', 'Dados de baja'],
            datasets: [{
                data: [120, 18, 8],
                backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Tabla de asignaciones recientes
async function cargarAsignacionesRecientes() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pcgestor/api/asignaciones/recientes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const asignaciones = await response.json();
            mostrarTablaAsignaciones(asignaciones);
            return;
        }
    } catch (error) {
        console.log('Usando datos de ejemplo para asignaciones');
    }
    
    // Datos de ejemplo
    const asignacionesEjemplo = [
        { fecha: '2024-01-01', equipo: 'Laptop HP', usuario: 'Ana Pérez' },
        { fecha: '2024-02-15', equipo: 'Escritorio Dell', usuario: 'Carlos Gómez' },
        { fecha: '2024-03-25', equipo: 'Monitor Samsung', usuario: 'Laura Rodríguez' },
        { fecha: '2024-04-30', equipo: 'Laptop Lenovo', usuario: 'Javier Martínez' }
    ];
    mostrarTablaAsignaciones(asignacionesEjemplo);
}

function mostrarTablaAsignaciones(asignaciones) {
    const tbody = $('#tablaAsignacionesRecientes tbody');
    tbody.empty();
    asignaciones.slice(0, 5).forEach(asig => {
        tbody.append(`
            <tr>
                <td>${formatDate(asig.fecha)}</td>
                <td>${asig.equipo}</td>
                <td>${asig.usuario}</td>
            </tr>
        `);
    });
}