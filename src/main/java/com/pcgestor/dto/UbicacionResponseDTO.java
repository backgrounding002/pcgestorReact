package com.pcgestor.dto;

import java.time.LocalDateTime;

public class UbicacionResponseDTO {
    private Long idUbicacion;
    private String edificio;
    private String piso;
    private String sala;
    private String descripcion;
    private LocalDateTime fechaCreacion;

    public Long getIdUbicacion() { return idUbicacion; }
    public void setIdUbicacion(Long idUbicacion) { this.idUbicacion = idUbicacion; }

    public String getEdificio() { return edificio; }
    public void setEdificio(String edificio) { this.edificio = edificio; }

    public String getPiso() { return piso; }
    public void setPiso(String piso) { this.piso = piso; }

    public String getSala() { return sala; }
    public void setSala(String sala) { this.sala = sala; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}