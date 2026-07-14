document.addEventListener('DOMContentLoaded', function() {
    cargarEstadisticas();
    configurarEventos();
});

function cargarEstadisticas() {
    console.log('PCGestor - Página de inicio cargada');
    
    const statusDiv = document.querySelector('.status');
    if (statusDiv) {
        setTimeout(function() {
            statusDiv.style.opacity = '1';
        }, 500);
    }
    
    fetch('http://localhost:8080/pcgestor/api/equipos')
        .then(function(response) {
            if (response.ok) {
                actualizarEstadoConexion(true);
            } else {
                actualizarEstadoConexion(false);
            }
        })
        .catch(function(error) {
            console.error('Error de conexión:', error);
            actualizarEstadoConexion(false);
        });
}

function actualizarEstadoConexion(conectado) {
    const statusDiv = document.querySelector('.status');
    if (statusDiv) {
        if (conectado) {
            statusDiv.style.background = '#4CAF50';
            statusDiv.innerHTML = '<span class="status-icon">✓</span> Sistema funcionando correctamente <span class="status-icon">🗄️</span>';
        } else {
            statusDiv.style.background = '#f56565';
            statusDiv.innerHTML = '<span class="status-icon">⚠️</span> Error de conexión con el servidor <span class="status-icon">⚠️</span>';
        }
    }
}

function configurarEventos() {
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const endpoints = document.querySelectorAll('.endpoint');
    endpoints.forEach(function(endpoint) {
        endpoint.addEventListener('click', function() {
            const code = this.querySelector('code');
            if (code) {
                const url = code.textContent;
                copiarAlPortapapeles(url);
            }
        });
    });
}

function copiarAlPortapapeles(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    mostrarNotificacion('URL copiada al portapapeles');
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.position = 'fixed';
    notificacion.style.bottom = '20px';
    notificacion.style.right = '20px';
    notificacion.style.backgroundColor = '#4CAF50';
    notificacion.style.color = 'white';
    notificacion.style.padding = '10px 20px';
    notificacion.style.borderRadius = '5px';
    notificacion.style.zIndex = '9999';
    notificacion.style.fontFamily = 'sans-serif';
    
    document.body.appendChild(notificacion);
    
    setTimeout(function() {
        notificacion.remove();
    }, 3000);
}