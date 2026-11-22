package com.pcgestor.controller;

import com.pcgestor.model.Usuario;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class RegisterController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody Map<String, String> request) {
        try {
            // CORRECCIÓN: Se agrega .trim() para evitar espacios en blanco invisibles
            String username = request.get("username") != null ? request.get("username").trim() : null;
            String password = request.get("password");

            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Usuario y contraseña son obligatorios\"}");
            }

            // Verificar si ya existe
            if (usuarioRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body("{\"error\": \"El nombre de usuario ya está en uso\"}");
            }

            // Crear usuario
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setPassword(passwordEncoder.encode(password));
            nuevoUsuario.setRole("ROLE_USER"); // Rol por defecto
            
            // CORRECCIÓN: Se cambió 'true' por '1' ya que el campo es Integer
            nuevoUsuario.setActivo(1); 
            
            nuevoUsuario.setEstado("Activo");

            usuarioRepository.save(nuevoUsuario);

            return ResponseEntity.status(HttpStatus.CREATED).body("{\"mensaje\": \"Usuario registrado exitosamente\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}