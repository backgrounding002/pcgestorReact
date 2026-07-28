package com.pcgestor.dto;

public class EquipoResponseDTO {
    private Long id;
    private String serial;
    private String marca;
    private String modelo;
    private String procesador;
    private String memoriaRAM;
    private String almacenamiento;
    private Boolean activo;
    private EstadoEquipoDTO estado;
    private UbicacionDTO ubicacion;
    private TipoEquipoDTO tipo;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getProcesador() { return procesador; }
    public void setProcesador(String procesador) { this.procesador = procesador; }

    public String getMemoriaRAM() { return memoriaRAM; }
    public void setMemoriaRAM(String memoriaRAM) { this.memoriaRAM = memoriaRAM; }

    public String getAlmacenamiento() { return almacenamiento; }
    public void setAlmacenamiento(String almacenamiento) { this.almacenamiento = almacenamiento; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public EstadoEquipoDTO getEstado() { return estado; }
    public void setEstado(EstadoEquipoDTO estado) { this.estado = estado; }

    public UbicacionDTO getUbicacion() { return ubicacion; }
    public void setUbicacion(UbicacionDTO ubicacion) { this.ubicacion = ubicacion; }

    public TipoEquipoDTO getTipo() { return tipo; }
    public void setTipo(TipoEquipoDTO tipo) { this.tipo = tipo; }
}