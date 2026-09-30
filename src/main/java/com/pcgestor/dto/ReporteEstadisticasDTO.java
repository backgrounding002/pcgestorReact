package com.pcgestor.dto;

public class ReporteEstadisticasDTO {
    private long totalEquipos;
    private long totalAsignaciones;
    private long totalMantenimientos;
    private long usuariosActivos;

    public long getTotalEquipos() { return totalEquipos; }
    public void setTotalEquipos(long totalEquipos) { this.totalEquipos = totalEquipos; }

    public long getTotalAsignaciones() { return totalAsignaciones; }
    public void setTotalAsignaciones(long totalAsignaciones) { this.totalAsignaciones = totalAsignaciones; }

    public long getTotalMantenimientos() { return totalMantenimientos; }
    public void setTotalMantenimientos(long totalMantenimientos) { this.totalMantenimientos = totalMantenimientos; }

    public long getUsuariosActivos() { return usuariosActivos; }
    public void setUsuariosActivos(long usuariosActivos) { this.usuariosActivos = usuariosActivos; }
}