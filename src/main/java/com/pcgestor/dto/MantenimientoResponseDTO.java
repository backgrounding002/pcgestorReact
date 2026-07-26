package com.pcgestor.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MantenimientoResponseDTO {
    private Long idMantenimiento;
    private LocalDate fecha;
    private String tipo;
    private String descripcion;
    private BigDecimal costo;
    private Long equipoId;
    private Long tecnicoId;
    private EquipoDTO equipo;
    private UsuarioDTO tecnico;

    // Getters y Setters
    public Long getIdMantenimiento() { return idMantenimiento; }
    public void setIdMantenimiento(Long idMantenimiento) { this.idMantenimiento = idMantenimiento; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public Long getTecnicoId() { return tecnicoId; }
    public void setTecnicoId(Long tecnicoId) { this.tecnicoId = tecnicoId; }

    public EquipoDTO getEquipo() { return equipo; }
    public void setEquipo(EquipoDTO equipo) { this.equipo = equipo; }

    public UsuarioDTO getTecnico() { return tecnico; }
    public void setTecnico(UsuarioDTO tecnico) { this.tecnico = tecnico; }
}