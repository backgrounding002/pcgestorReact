package com.pcgestor.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReporteResponseDTO {
    private Long idReporte;
    private LocalDate fecha;
    private String tipo;
    private String contenido;
    private Long adminId;
    private String adminUsername;
    private LocalDateTime fechaCreacion;

    public Long getIdReporte() { return idReporte; }
    public void setIdReporte(Long idReporte) { this.idReporte = idReporte; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }

    public String getAdminUsername() { return adminUsername; }
    public void setAdminUsername(String adminUsername) { this.adminUsername = adminUsername; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}