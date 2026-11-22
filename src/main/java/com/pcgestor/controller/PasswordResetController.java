package com.pcgestor.controller;

import com.pcgestor.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    // Endpoint para solicitar el token
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String token = passwordResetService.solicitarRecuperacion(username);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Token generado exitosamente (SIMULACIÓN)");
            response.put("token_simulado", token); // Se devuelve en el JSON para el Frontend
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Endpoint para cambiar la contraseña
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String nuevaPassword = request.get("nuevaPassword");
            
            String mensaje = passwordResetService.cambiarPassword(token, nuevaPassword);
            return ResponseEntity.ok("{\"mensaje\": \"" + mensaje + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}