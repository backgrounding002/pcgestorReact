package com.pcgestor.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long equiposActivos;
    private long equiposDisponibles;
    private long mantenimientosPendientes;
    private long asignacionesActivas;
    private List<Map<String, Object>> equiposPorEstado;
    private List<Map<String, Object>> asignacionesRecientes;

    public long getEquiposActivos() { return equiposActivos; }
    public void setEquiposActivos(long equiposActivos) { this.equiposActivos = equiposActivos; }

    public long getEquiposDisponibles() { return equiposDisponibles; }
    public void setEquiposDisponibles(long equiposDisponibles) { this.equiposDisponibles = equiposDisponibles; }

    public long getMantenimientosPendientes() { return mantenimientosPendientes; }
    public void setMantenimientosPendientes(long mantenimientosPendientes) { this.mantenimientosPendientes = mantenimientosPendientes; }

    public long getAsignacionesActivas() { return asignacionesActivas; }
    public void setAsignacionesActivas(long asignacionesActivas) { this.asignacionesActivas = asignacionesActivas; }

    public List<Map<String, Object>> getEquiposPorEstado() { return equiposPorEstado; }
    public void setEquiposPorEstado(List<Map<String, Object>> equiposPorEstado) { this.equiposPorEstado = equiposPorEstado; }

    public List<Map<String, Object>> getAsignacionesRecientes() { return asignacionesRecientes; }
    public void setAsignacionesRecientes(List<Map<String, Object>> asignacionesRecientes) { this.asignacionesRecientes = asignacionesRecientes; }
}