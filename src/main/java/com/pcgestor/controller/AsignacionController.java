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

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionController {
    
    @Autowired
    private AsignacionService asignacionService;
    
    @GetMapping
    public ResponseEntity<List<AsignacionResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(asignacionService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AsignacionResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(asignacionService.obtenerPorId(id));
    }
    
    @PostMapping
    public ResponseEntity<AsignacionResponseDTO> crear(@RequestBody AsignacionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asignacionService.crear(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AsignacionResponseDTO> actualizar(@PathVariable Long id, 
                                                           @RequestBody AsignacionDTO dto) {
        return ResponseEntity.ok(asignacionService.actualizar(id, dto));
    }
    
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstado(@PathVariable Long id, 
                                                             @RequestBody Map<String, Boolean> request) {
        Boolean activa = request.get("activa");
        if (activa == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El campo 'activa' es requerido");
            return ResponseEntity.badRequest().body(error);
        }
        
        asignacionService.cambiarEstado(id, activa);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Estado actualizado correctamente");
        response.put("activa", activa.toString());
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}