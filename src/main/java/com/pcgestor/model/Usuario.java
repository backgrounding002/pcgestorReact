package com.pcgestor.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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

    public Usuario() {}
    public Usuario(Long id, String username, String password, String role) {
        this.id = id; this.username = username; this.password = password; this.role = role;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // Builder manual (para DataInitializer)
    public static UsuarioBuilder builder() { return new UsuarioBuilder(); }
    public static class UsuarioBuilder {
        private String username; private String password; private String role;
        public UsuarioBuilder username(String username) { this.username = username; return this; }
        public UsuarioBuilder password(String password) { this.password = password; return this; }
        public UsuarioBuilder role(String role) { this.role = role; return this; }
        public Usuario build() { return new Usuario(null, username, password, role); }
    }
}