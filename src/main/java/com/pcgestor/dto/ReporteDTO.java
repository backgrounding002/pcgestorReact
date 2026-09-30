package com.pcgestor.dto;

import java.time.LocalDate;

public class ReporteDTO {
    private Long idReporte;
    private LocalDate fecha;
    private String tipo;
    private String contenido;
    private Long adminId;

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
}