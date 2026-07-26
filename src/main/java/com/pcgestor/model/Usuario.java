package com.pcgestor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(unique = true)
    private String username;
    @NotBlank
    private String password;
    private String role = "ROLE_USER";
    
    @Column(name = "activo")
    private Integer activo = 1;
    
    @Column(name = "estado")
    private String estado = "Activo";

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Asignacion> asignaciones;

    public Usuario() {}

    public Usuario(Long id, String username, String password, String role) {
        this.id = id; 
        this.username = username; 
        this.password = password; 
        this.role = role;
        this.activo = 1;
        this.estado = "Activo";
    }

    public Usuario(Long id, String username, String password, String role, Integer activo, String estado) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.activo = activo != null ? activo : 1;
        this.estado = estado != null ? estado : "Activo";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Integer getActivo() { return activo; }
    public void setActivo(Integer activo) { this.activo = activo; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<Asignacion> getAsignaciones() { return asignaciones; }
    public void setAsignaciones(List<Asignacion> asignaciones) { this.asignaciones = asignaciones; }

    public static UsuarioBuilder builder() { return new UsuarioBuilder(); }
    public static class UsuarioBuilder {
        private String username; 
        private String password; 
        private String role;
        private Integer activo = 1;
        private String estado = "Activo";
        
        public UsuarioBuilder username(String username) { 
            this.username = username; 
            return this; 
        }
        public UsuarioBuilder password(String password) { 
            this.password = password; 
            return this; 
        }
        public UsuarioBuilder role(String role) { 
            this.role = role; 
            return this; 
        }
        public UsuarioBuilder activo(Integer activo) {
            this.activo = activo;
            return this;
        }
        public UsuarioBuilder estado(String estado) {
            this.estado = estado;
            return this;
        }
        public Usuario build() { 
            return new Usuario(null, username, password, role, activo, estado); 
        }
    }
}