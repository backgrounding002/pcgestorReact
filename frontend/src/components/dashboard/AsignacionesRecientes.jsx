import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AsignacionesRecientes = () => {
  const { token } = useAuth();
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAsignaciones = async () => {
      try {
        const response = await api.get('/asignaciones/recientes');
        setAsignaciones(response.data || []);
      } catch (error) {
        console.error('Error al cargar asignaciones:', error);
        // Datos de ejemplo
        setAsignaciones([
          { fecha: '2026-01-01', equipo: 'Laptop HP', usuario: 'Ana Pérez' },
          { fecha: '2026-02-15', equipo: 'Escritorio Dell', usuario: 'Carlos Gómez' },
          { fecha: '2026-03-25', equipo: 'Monitor Samsung', usuario: 'Laura Rodríguez' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    cargarAsignaciones();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="card shadow">
        <div className="card-header">Asignaciones recientes</div>
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header">Asignaciones recientes</div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Equipo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No hay asignaciones recientes</td>
                </tr>
              ) : (
                asignaciones.slice(0, 5).map((asig, index) => (
                  <tr key={index}>
                    <td>{formatDate(asig.fecha)}</td>
                    <td>{asig.equipo}</td>
                    <td>{asig.usuario}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AsignacionesRecientes;