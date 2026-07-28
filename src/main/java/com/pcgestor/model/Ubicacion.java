package com.pcgestor.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ubicaciones")
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Long idUbicacion;

    @Column(name = "edificio")
    private String edificio;

    @Column(name = "piso")
    private String piso;

    @Column(name = "sala")
    private String sala;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Ubicacion() {}

    public Ubicacion(Long idUbicacion, String edificio, String piso, String sala, String descripcion) {
        this.idUbicacion = idUbicacion;
        this.edificio = edificio;
        this.piso = piso;
        this.sala = sala;
        this.descripcion = descripcion;
    }

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