// ============================================
// api.js - Comunicación con el backend Spring Boot
// Sin datos simulados: si el backend falla, el error se propaga
// ============================================

const API_BASE_URL = 'http://localhost:8086/pcgestor/api';

class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, method = 'GET', data = null) {
        const config = {
            method: method,
            headers: this.getHeaders()
        };
        if (data) config.body = JSON.stringify(data);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (response.status === 401) {
            this.logout();
            throw new Error('Sesión expirada');
        }

        if (response.status === 403) {
            throw new Error('No tienes permisos para esta operación');
        }

        if (response.status === 204) return null;

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            if (!response.ok) throw new Error('Error ' + response.status);
            return null;
        }

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || result.error || ('Error ' + response.status));
        }
        return result;
    }

    // ============ Autenticación ============
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            let msg = 'Credenciales incorrectas';
            try { const e = await response.json(); msg = e.message || e.error || msg; } catch (ignored) {}
            throw new Error(msg);
        }
        const data = await response.json();
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
        }
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // ============ Dashboard ============
    getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    // ============ Reportes ============
    getReporteEstadisticas() {
        return this.request('/reportes/estadisticas');
    }

    // ============ Equipos ============
    getEquipos()          { return this.request('/equipos'); }
    getEquipo(id)         { return this.request(`/equipos/${id}`); }
    createEquipo(e)       { return this.request('/equipos', 'POST', e); }
    updateEquipo(id, e)   { return this.request(`/equipos/${id}`, 'PUT', e); }
    deleteEquipo(id)      { return this.request(`/equipos/${id}`, 'DELETE'); }

    // ============ Usuarios ============
    getUsuarios()         { return this.request('/usuarios'); }
    getUsuario(id)        { return this.request(`/usuarios/${id}`); }
    createUsuario(u)      { return this.request('/usuarios', 'POST', u); }
    updateUsuario(id, u)  { return this.request(`/usuarios/${id}`, 'PUT', u); }
    deleteUsuario(id)     { return this.request(`/usuarios/${id}`, 'DELETE'); }

    // ============ Asignaciones ============
    getAsignaciones()            { return this.request('/asignaciones'); }
    getAsignacion(id)            { return this.request(`/asignaciones/${id}`); }
    createAsignacion(a)          { return this.request('/asignaciones', 'POST', a); }
    updateAsignacion(id, a)      { return this.request(`/asignaciones/${id}`, 'PUT', a); }
    deleteAsignacion(id)         { return this.request(`/asignaciones/${id}`, 'DELETE'); }
    cambiarEstadoAsignacion(id, activa) {
        return this.request(`/asignaciones/${id}/estado`, 'PATCH', { activa });
    }

    // ============ Mantenimientos ============
    getMantenimientos()          { return this.request('/mantenimientos'); }
    getMantenimiento(id)         { return this.request(`/mantenimientos/${id}`); }
    createMantenimiento(m)       { return this.request('/mantenimientos', 'POST', m); }
    updateMantenimiento(id, m)   { return this.request(`/mantenimientos/${id}`, 'PUT', m); }
    deleteMantenimiento(id)      { return this.request(`/mantenimientos/${id}`, 'DELETE'); }

    // ============ Ubicaciones ============
    getUbicaciones()             { return this.request('/ubicaciones'); }
    createUbicacion(u)           { return this.request('/ubicaciones', 'POST', u); }
    updateUbicacion(id, u)       { return this.request(`/ubicaciones/${id}`, 'PUT', u); }
    deleteUbicacion(id)          { return this.request(`/ubicaciones/${id}`, 'DELETE'); }

    // ============ Catálogos ============
    getTiposEquipo()             { return this.request('/tipos-equipo'); }
    getEstadosEquipo()           { return this.request('/estados-equipo'); }

    // ============ Exportación ============
    async descargarArchivo(endpoint, nombreArchivo) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });

        if (response.status === 401) { this.logout(); throw new Error('Sesión expirada'); }
        if (response.status === 403) { throw new Error('No tienes permisos para exportar'); }
        if (!response.ok) throw new Error('Error al exportar: ' + response.status);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

const api = new API();