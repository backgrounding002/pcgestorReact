package com.pcgestor.service;

import com.pcgestor.model.Usuario;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Bloquear si el usuario está inactivo
        if (usuario.getActivo() != null && usuario.getActivo() == 0) {
            throw new UsernameNotFoundException("Usuario inactivo: " + username);
        }

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(normalizarRol(usuario.getRole()))
                .build();
    }

    /**
     * Normaliza los roles almacenados en la BD (que pueden venir como
     * 'ROLE_ADMIN', 'Administrador', 'Técnico', 'Empleado', 'ROLE_USER')
     * a un único conjunto consistente: ADMIN, TECNICO, USER.
     */
    private String normalizarRol(String role) {
        if (role == null) return "USER";
        String r = role.toUpperCase().replace("ROLE_", "").trim();
        if (r.contains("ADMIN") || r.contains("ADMINISTRADOR")) return "ADMIN";
        if (r.contains("TECNICO") || r.contains("TÉCNICO")) return "TECNICO";
        return "USER";
    }
}