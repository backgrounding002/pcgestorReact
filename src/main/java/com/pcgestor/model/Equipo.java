package com.pcgestor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "serial")
    private String serial;

    @Column(name = "marca")
    private String marca;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "procesador")
    private String procesador;

    @Column(name = "memoriaram")
    private String memoriaRAM;

    @Column(name = "almacenamiento")
    private String almacenamiento;

    // Relación con TipoEquipo (cargada de forma perezosa, ignora si no existe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_id", referencedColumnName = "id_tipo")
    @NotFound(action = NotFoundAction.IGNORE)
    private TipoEquipo tipo;

    @Column(name = "activo")
    private Boolean activo;

    // Relación con EstadoEquipo (cargada de forma perezosa, ignora si no existe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id", referencedColumnName = "id_estado")
    @NotFound(action = NotFoundAction.IGNORE)
    private EstadoEquipo estado;

    // Relación con Ubicacion (cargada de forma perezosa, ignora si no existe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ubicacion_id", referencedColumnName = "id_ubicacion")
    @NotFound(action = NotFoundAction.IGNORE)
    private Ubicacion ubicacionEntity;

    @JsonIgnore
    @OneToMany(mappedBy = "equipo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Asignacion> asignaciones;

    // Constructores
    public Equipo() {}

    public Equipo(Long id, String serial, String marca, String modelo, String procesador,
                  String memoriaRAM, String almacenamiento, TipoEquipo tipo, Boolean activo,
                  EstadoEquipo estado, Ubicacion ubicacionEntity) {
        this.id = id;
        this.serial = serial;
        this.marca = marca;
        this.modelo = modelo;
        this.procesador = procesador;
        this.memoriaRAM = memoriaRAM;
        this.almacenamiento = almacenamiento;
        this.tipo = tipo;
        this.activo = activo;
        this.estado = estado;
        this.ubicacionEntity = ubicacionEntity;
    }

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

    public TipoEquipo getTipo() { return tipo; }
    public void setTipo(TipoEquipo tipo) { this.tipo = tipo; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public EstadoEquipo getEstado() { return estado; }
    public void setEstado(EstadoEquipo estado) { this.estado = estado; }

    public Ubicacion getUbicacionEntity() { return ubicacionEntity; }
    public void setUbicacionEntity(Ubicacion ubicacionEntity) { this.ubicacionEntity = ubicacionEntity; }

    public List<Asignacion> getAsignaciones() { return asignaciones; }
    public void setAsignaciones(List<Asignacion> asignaciones) { this.asignaciones = asignaciones; }
}