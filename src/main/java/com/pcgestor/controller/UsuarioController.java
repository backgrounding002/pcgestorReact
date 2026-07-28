package com.pcgestor.controller;

import com.pcgestor.model.Usuario;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            return ResponseEntity.ok(usuarioRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return usuarioRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario) {
        try {
            if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("El usuario ya existe");
            }
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            if (usuario.getEstado() == null || usuario.getEstado().isEmpty()) {
                usuario.setEstado("Activo");
            }
            if (usuario.getActivo() == null) {
                usuario.setActivo(1);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRepository.save(usuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            return usuarioRepository.findById(id)
                    .map(existing -> {
                        existing.setUsername(usuario.getUsername());
                        existing.setRole(usuario.getRole());
                        if (usuario.getEstado() != null) {
                            existing.setEstado(usuario.getEstado());
                        }
                        if (usuario.getActivo() != null) {
                            existing.setActivo(usuario.getActivo());
                        }
                        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
                            existing.setPassword(passwordEncoder.encode(usuario.getPassword()));
                        }
                        return ResponseEntity.ok(usuarioRepository.save(existing));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (usuarioRepository.existsById(id)) {
                usuarioRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            return usuarioRepository.findById(id)
                    .map(usuario -> {
                        String nuevaPassword = request.get("password");
                        if (nuevaPassword == null || nuevaPassword.length() < 6) {
                            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 6 caracteres");
                        }
                        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
                        usuarioRepository.save(usuario);
                        return ResponseEntity.ok().body("Contraseña actualizada correctamente");
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            return usuarioRepository.findById(id)
                    .map(usuario -> {
                        if (request.containsKey("activo")) {
                            Integer activo = (Integer) request.get("activo");
                            usuario.setActivo(activo);
                            usuario.setEstado(activo == 1 ? "Activo" : "Inactivo");
                        } else if (request.containsKey("estado")) {
                            String estado = (String) request.get("estado");
                            usuario.setEstado(estado);
                            usuario.setActivo(estado.equals("Activo") ? 1 : 0);
                        }
                        return ResponseEntity.ok(usuarioRepository.save(usuario));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}