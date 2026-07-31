package com.pcgestor.controller;

import com.pcgestor.dto.AsignacionDTO;
import com.pcgestor.dto.AsignacionResponseDTO;
import com.pcgestor.service.AsignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de asignaciones de equipos.
 * Expone endpoints para operaciones CRUD y consultas específicas.
 */
@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionController {
    
    @Autowired
    private AsignacionService asignacionService;
    
    /**
     * Obtiene todas las asignaciones registradas.
     * @return Lista de asignaciones
     */
    @GetMapping
    public ResponseEntity<List<AsignacionResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(asignacionService.obtenerTodas());
    }
    
    /**
     * Obtiene una asignación por su ID.
     * @param id Identificador de la asignación
     * @return Asignación encontrada o error 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            AsignacionResponseDTO asignacion = asignacionService.obtenerPorId(id);
            return ResponseEntity.ok(asignacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Obtiene todas las asignaciones de un usuario específico.
     * @param usuarioId ID del usuario
     * @return Lista de asignaciones del usuario o error 404 si no existe
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<AsignacionResponseDTO> asignaciones = asignacionService.obtenerPorUsuario(usuarioId);
            return ResponseEntity.ok(asignaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Obtiene todas las asignaciones de un equipo específico (opcional).
     * @param equipoId ID del equipo
     * @return Lista de asignaciones del equipo
     */
    @GetMapping("/equipo/{equipoId}")
    public ResponseEntity<?> obtenerPorEquipo(@PathVariable Long equipoId) {
        try {
            List<AsignacionResponseDTO> asignaciones = asignacionService.obtenerPorEquipo(equipoId);
            return ResponseEntity.ok(asignaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Crea una nueva asignación.
     * @param dto Datos de la asignación
     * @return Asignación creada
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody AsignacionDTO dto) {
        try {
            AsignacionResponseDTO creada = asignacionService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Actualiza una asignación existente.
     * @param id ID de la asignación
     * @param dto Datos actualizados
     * @return Asignación actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody AsignacionDTO dto) {
        try {
            AsignacionResponseDTO actualizada = asignacionService.actualizar(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Cambia el estado (activa/inactiva) de una asignación.
     * @param id ID de la asignación
     * @param request Mapa con el campo "activa": true/false
     * @return Mensaje de éxito o error
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean activa = request.get("activa");
        if (activa == null) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"El campo 'activa' es requerido\"}");
        }
        try {
            asignacionService.cambiarEstado(id, activa);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Estado actualizado correctamente");
            response.put("activa", activa.toString());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Elimina una asignación por su ID.
     * @param id ID de la asignación
     * @return Respuesta sin contenido
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            asignacionService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}