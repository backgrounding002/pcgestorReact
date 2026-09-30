package com.pcgestor.config;

import com.pcgestor.model.Usuario;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("admin",   "admin123",   "ROLE_ADMIN");
        crearSiNoExiste("tecnico", "tecnico123", "ROLE_TECNICO");
        crearSiNoExiste("usuario", "usuario123", "ROLE_USER");
    }

    private void crearSiNoExiste(String username, String rawPassword, String role) {
        if (usuarioRepository.findByUsername(username).isEmpty()) {
            Usuario u = Usuario.builder()
                    .username(username)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .activo(1)
                    .estado("Activo")
                    .build();
            usuarioRepository.save(u);
            System.out.println("Usuario creado: " + username + " [" + role + "]");
        }
    }
}