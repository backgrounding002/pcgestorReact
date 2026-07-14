package com.pcgestor.model;

import javax.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String serial;
    private String marca;
    private String modelo;
    private String procesador;
    private String memoriaRAM;
    private String almacenamiento;
    private String estado;
    private String ubicacion;

    public Equipo() {}
    // Constructor con todos los campos (opcional)
    public Equipo(Long id, String serial, String marca, String modelo, String procesador,
                  String memoriaRAM, String almacenamiento, String estado, String ubicacion) {
        this.id = id; this.serial = serial; this.marca = marca; this.modelo = modelo;
        this.procesador = procesador; this.memoriaRAM = memoriaRAM; this.almacenamiento = almacenamiento;
        this.estado = estado; this.ubicacion = ubicacion;
    }

    // Getters y Setters (todos)
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
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
}