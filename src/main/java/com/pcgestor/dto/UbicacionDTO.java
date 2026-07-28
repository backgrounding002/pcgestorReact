package com.pcgestor.dto;

public class UbicacionDTO {

    private Long idUbicacion;
    private String edificio;
    private String piso;
    private String sala;
    private String descripcion;

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
}