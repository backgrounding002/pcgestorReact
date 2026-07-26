package com.pcgestor.controller;

import com.pcgestor.model.Equipo;
import com.pcgestor.repository.EquipoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {
    private final EquipoRepository repository;

    public EquipoController(EquipoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            System.out.println("=== GET /api/equipos ===");
            List<Equipo> equipos = repository.findAll();
            System.out.println("Equipos encontrados: " + equipos.size());
            
            equipos.forEach(e -> {
                System.out.println("ID: " + e.getId() + 
                                 ", Marca: " + e.getMarca() + 
                                 ", Modelo: " + e.getModelo() + 
                                 ", Serial: " + e.getSerial());
            });
            
            return ResponseEntity.ok(equipos);
        } catch (Exception e) {
            System.err.println("ERROR en GET /api/equipos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Equipo equipo = repository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            System.out.println("Equipo encontrado: " + equipo.getSerial());
            return ResponseEntity.ok(equipo);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error al obtener equipo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Equipo equipo) {
        try {
            System.out.println("=== CREANDO EQUIPO: " + equipo.getSerial() + " ===");
            
            Equipo saved = repository.save(equipo);
            System.out.println("EQUIPO CREADO: " + saved.getSerial());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("Error al crear equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Equipo equipo) {
        try {
            if (!repository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
            equipo.setId(id);
            Equipo updated = repository.save(equipo);
            System.out.println("Equipo actualizado: " + updated.getSerial());
            return ResponseEntity.ok(updated);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error al actualizar equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (!repository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
            repository.deleteById(id);
            System.out.println("Equipo eliminado: " + id);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error al eliminar equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}