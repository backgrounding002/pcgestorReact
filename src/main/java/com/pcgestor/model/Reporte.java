package com.pcgestor.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Long idReporte;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "tipo", nullable = false, length = 50)
    private String tipo;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Reporte() {}

    public Reporte(Long idReporte, LocalDate fecha, String tipo, String contenido, Long adminId) {
        this.idReporte = idReporte;
        this.fecha = fecha;
        this.tipo = tipo;
        this.contenido = contenido;
        this.adminId = adminId;
    }

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

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
