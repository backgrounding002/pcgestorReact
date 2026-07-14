// ============================================
// api.js - Comunicación con el backend Spring Boot
// ============================================

// Configuración base
const API_BASE_URL = 'http://localhost:8086/pcgestor/api';  

// ============================================
// Clase principal API
// ============================================
class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Obtener headers con autenticación
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Método genérico para peticiones fetch
    async request(endpoint, method = 'GET', data = null) {
        const config = {
            method: method,
            headers: this.getHeaders()
        };
        if (data) config.body = JSON.stringify(data);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            
            // Si el token expiró o es inválido, redirigir al login
            if (response.status === 401) {
                this.logout();
                throw new Error('Sesión expirada');
            }
            
            // Para respuestas sin contenido (ej. DELETE)
            if (response.status === 204) return null;
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || result.error || 'Error en la petición');
            return result;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ============================================
    // Autenticación
    // ============================================
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Credenciales incorrectas');
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

    // ============================================
    // Equipos
    // ============================================
    async getEquipos() {
        try {
            return await this.request('/equipos');
        } catch (error) {
            console.warn('Usando datos simulados de equipos');
            return this._getMockEquipos();
        }
    }

    async getEquipo(id) {
        try {
            return await this.request(`/equipos/${id}`);
        } catch (error) {
            const mock = this._getMockEquipos().find(e => e.id == id);
            return mock || null;
        }
    }

    async createEquipo(equipo) {
        try {
            return await this.request('/equipos', 'POST', equipo);
        } catch (error) {
            console.warn('Simulando creación de equipo');
            const nuevo = { id: Date.now(), ...equipo };
            return nuevo;
        }
    }

    async updateEquipo(id, equipo) {
        try {
            return await this.request(`/equipos/${id}`, 'PUT', equipo);
        } catch (error) {
            console.warn('Simulando actualización de equipo');
            return { id, ...equipo };
        }
    }

    async deleteEquipo(id) {
        try {
            return await this.request(`/equipos/${id}`, 'DELETE');
        } catch (error) {
            console.warn('Simulando eliminación de equipo');
            return true;
        }
    }

    // ============================================
    // Usuarios
    // ============================================
    async getUsuarios() {
        try {
            return await this.request('/usuarios');
        } catch (error) {
            console.warn('Usando datos simulados de usuarios');
            return this._getMockUsuarios();
        }
    }

    async getUsuario(id) {
        try {
            return await this.request(`/usuarios/${id}`);
        } catch (error) {
            return this._getMockUsuarios().find(u => u.id == id) || null;
        }
    }

    async createUsuario(usuario) {
        try {
            return await this.request('/usuarios', 'POST', usuario);
        } catch (error) {
            const nuevo = { id: Date.now(), ...usuario };
            return nuevo;
        }
    }

    async updateUsuario(id, usuario) {
        try {
            return await this.request(`/usuarios/${id}`, 'PUT', usuario);
        } catch (error) {
            return { id, ...usuario };
        }
    }

    async deleteUsuario(id) {
        try {
            return await this.request(`/usuarios/${id}`, 'DELETE');
        } catch (error) {
            return true;
        }
    }

    // ============================================
    // Asignaciones
    // ============================================
    async getAsignaciones() {
        try {
            return await this.request('/asignaciones');
        } catch (error) {
            return this._getMockAsignaciones();
        }
    }

    async createAsignacion(asignacion) {
        try {
            return await this.request('/asignaciones', 'POST', asignacion);
        } catch (error) {
            const nueva = { id: Date.now(), ...asignacion };
            return nueva;
        }
    }

    async updateAsignacion(id, asignacion) {
        try {
            return await this.request(`/asignaciones/${id}`, 'PUT', asignacion);
        } catch (error) {
            return { id, ...asignacion };
        }
    }

    async deleteAsignacion(id) {
        try {
            return await this.request(`/asignaciones/${id}`, 'DELETE');
        } catch (error) {
            return true;
        }
    }

    // ============================================
    // Mantenimientos
    // ============================================
    async getMantenimientos() {
        try {
            return await this.request('/mantenimientos');
        } catch (error) {
            return this._getMockMantenimientos();
        }
    }

    async createMantenimiento(mantenimiento) {
        try {
            return await this.request('/mantenimientos', 'POST', mantenimiento);
        } catch (error) {
            const nuevo = { id: Date.now(), ...mantenimiento };
            return nuevo;
        }
    }

    // ============================================
    // Ubicaciones
    // ============================================
    async getUbicaciones() {
        try {
            return await this.request('/ubicaciones');
        } catch (error) {
            return [
                { id: 1, nombre: 'Oficina 101', edificio: 'Edificio A', sala: '101' },
                { id: 2, nombre: 'Oficina 102', edificio: 'Edificio A', sala: '102' },
                { id: 3, nombre: 'Bodega', edificio: 'Edificio B', sala: '1' }
            ];
        }
    }

    // ============================================
    // Estadísticas (dashboard)
    // ============================================
    async getEstadisticas() {
        try {
            return await this.request('/estadisticas');
        } catch (error) {
            return {
                totalEquipos: 146,
                equiposDisponibles: 89,
                mantenimientosPendientes: 32,
                totalAsignaciones: 25,
                equiposPorEstado: [
                    { estado: 'Activo', cantidad: 120 },
                    { estado: 'En mantenimiento', cantidad: 18 },
                    { estado: 'Dado de baja', cantidad: 8 }
                ]
            };
        }
    }

    // ============================================
    // Métodos auxiliares con datos simulados (mock)
    // ============================================
    _getMockEquipos() {
        return [
            { id: 1, marca: 'HP', modelo: 'Pavilion', serial: 'HP001', estado: 'Activo', ubicacion: 'Oficina 101' },
            { id: 2, marca: 'Dell', modelo: 'Latitude', serial: 'DEL002', estado: 'Activo', ubicacion: 'Oficina 102' },
            { id: 3, marca: 'Samsung', modelo: 'Monitor', serial: 'SAM003', estado: 'En mantenimiento', ubicacion: 'Bodega' },
            { id: 4, marca: 'Lenovo', modelo: 'ThinkPad', serial: 'LEN004', estado: 'Activo', ubicacion: 'Oficina 103' }
        ];
    }

    _getMockUsuarios() {
        return [
            { id: 1, nombre: 'Federico', correo: 'fedro@example.com', telefono: '3001234567', rol: 'Administrador', estado: 'Activo' },
            { id: 2, nombre: 'Laura', correo: 'laura@example.com', telefono: '3109876543', rol: 'Empleado', estado: 'Activo' },
            { id: 3, nombre: 'Javier', correo: 'javier@example.com', telefono: '3204567890', rol: 'Técnico', estado: 'Activo' },
            { id: 4, nombre: 'María', correo: 'maria@example.com', telefono: '3012345678', rol: 'Empleado', estado: 'Activo' }
        ];
    }

    _getMockAsignaciones() {
        return [
            { id: 1, fecha: '2024-01-01', equipo: 'Laptop HP', usuario: 'Ana Pérez', motivo: 'Desarrollo' },
            { id: 2, fecha: '2024-02-15', equipo: 'Escritorio Dell', usuario: 'Carlos Gómez', motivo: 'Administración' },
            { id: 3, fecha: '2024-03-25', equipo: 'Monitor Samsung', usuario: 'Laura Rodríguez', motivo: 'Diseño' }
        ];
    }

    _getMockMantenimientos() {
        return [
            { id: 1, fecha: '2024-01-10', tipo: 'Preventivo', equipo: 'Laptop HP', costo: 50000, descripcion: 'Limpieza interna' },
            { id: 2, fecha: '2024-02-20', tipo: 'Correctivo', equipo: 'Escritorio Dell', costo: 120000, descripcion: 'Cambio de fuente' }
        ];
    }
}

// Instancia global para usar en todo el frontend
const api = new API();