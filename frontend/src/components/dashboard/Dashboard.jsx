import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import StatsCard from './StatsCard';
import EquiposChart from './EquiposChart';
import AsignacionesRecientes from './AsignacionesRecientes';
import Spinner from '../common/Spinner';
import AlertError from '../common/AlertError';

const Dashboard = () => {
  const { token } = useAuth();
  const [estadisticas, setEstadisticas] = useState({
    totalEquipos: 0,
    equiposDisponibles: 0,
    mantenimientosPendientes: 0,
    totalAsignaciones: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/estadisticas');
        setEstadisticas(response.data);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard');
        // Datos de ejemplo para mostrar
        setEstadisticas({
          totalEquipos: 146,
          equiposDisponibles: 89,
          mantenimientosPendientes: 32,
          totalAsignaciones: 25,
        });
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [token]);

  if (loading) return <Spinner message="Cargando dashboard..." />;
  if (error) return <AlertError message={error} />;

  return (
    <>
      <h1 className="mt-4">Dashboard</h1>
      <div className="row">
        <StatsCard
          title="Equipos activos"
          value={estadisticas.totalEquipos}
          icon="fa-laptop"
          color="primary"
        />
        <StatsCard
          title="Equipos disponibles"
          value={estadisticas.equiposDisponibles}
          icon="fa-check-circle"
          color="success"
        />
        <StatsCard
          title="Mantenimientos pendientes"
          value={estadisticas.mantenimientosPendientes}
          icon="fa-tools"
          color="warning"
        />
        <StatsCard
          title="Asignaciones activas"
          value={estadisticas.totalAsignaciones}
          icon="fa-exchange-alt"
          color="danger"
        />
      </div>

      <div className="row mt-4">
        <div className="col-xl-6">
          <EquiposChart />
        </div>
        <div className="col-xl-6">
          <AsignacionesRecientes />
        </div>
      </div>
    </>
  );
};

export default Dashboard;