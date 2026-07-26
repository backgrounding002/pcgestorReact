package com.pcgestor.dto;

import java.time.LocalDate;

public class AsignacionResponseDTO {
    private Long idAsignacion;
    private LocalDate fechaAsignacion;
    private String motivo;
    private Long equipoId;
    private Long usuarioId;
    private Boolean activa;
    private EquipoDTO equipo;
    private UsuarioDTO usuario;
    
    public AsignacionResponseDTO() {}
    
    public AsignacionResponseDTO(Long idAsignacion, LocalDate fechaAsignacion, String motivo, 
                                 Long equipoId, Long usuarioId, Boolean activa) {
        this.idAsignacion = idAsignacion;
        this.fechaAsignacion = fechaAsignacion;
        this.motivo = motivo;
        this.equipoId = equipoId;
        this.usuarioId = usuarioId;
        this.activa = activa;
    }
    
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    
    public LocalDate getFechaAsignacion() {
        return fechaAsignacion;
    }
    
    public void setFechaAsignacion(LocalDate fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public Long getEquipoId() {
        return equipoId;
    }
    
    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public Boolean getActiva() {
        return activa;
    }
    
    public void setActiva(Boolean activa) {
        this.activa = activa;
    }
    
    public EquipoDTO getEquipo() {
        return equipo;
    }
    
    public void setEquipo(EquipoDTO equipo) {
        this.equipo = equipo;
    }
    
    public UsuarioDTO getUsuario() {
        return usuario;
    }
    
    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
}