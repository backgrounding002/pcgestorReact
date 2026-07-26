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
            System.out.println("=== GET /api/usuarios ===");
            List<Usuario> usuarios = usuarioRepository.findAll();
            System.out.println("Usuarios encontrados: " + usuarios.size());
            
            // Log de cada usuario
            usuarios.forEach(u -> {
                System.out.println("ID: " + u.getId() + 
                                 ", Username: " + u.getUsername() + 
                                 ", Activo: " + u.getActivo() + 
                                 ", Estado: " + u.getEstado());
            });
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return usuarioRepository.findById(id)
                    .map(usuario -> {
                        System.out.println("Usuario encontrado: " + usuario.getUsername());
                        return ResponseEntity.ok(usuario);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al obtener usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario) {
        try {
            System.out.println("=== CREANDO USUARIO: " + usuario.getUsername() + " ===");
            
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
            
            Usuario saved = usuarioRepository.save(usuario);
            System.out.println("USUARIO CREADO: " + saved.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (Exception e) {
            System.err.println("Error al crear usuario: " + e.getMessage());
            e.printStackTrace();
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
                        
                        Usuario updated = usuarioRepository.save(existing);
                        System.out.println("Usuario actualizado: " + updated.getUsername());
                        return ResponseEntity.ok(updated);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al actualizar usuario: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (usuarioRepository.existsById(id)) {
                usuarioRepository.deleteById(id);
                System.out.println("Usuario eliminado: " + id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error al eliminar usuario: " + e.getMessage());
            e.printStackTrace();
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
                        System.out.println("Contraseña actualizada para: " + usuario.getUsername());
                        return ResponseEntity.ok().body("Contraseña actualizada correctamente");
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al cambiar contraseña: " + e.getMessage());
            e.printStackTrace();
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
                        Usuario updated = usuarioRepository.save(usuario);
                        System.out.println("Estado actualizado para: " + updated.getUsername());
                        return ResponseEntity.ok(updated);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al cambiar estado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}