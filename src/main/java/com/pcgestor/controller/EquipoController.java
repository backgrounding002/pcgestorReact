package com.pcgestor.controller;

import com.pcgestor.dto.EquipoDTO;
import com.pcgestor.dto.EquipoResponseDTO;
import com.pcgestor.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {

    @Autowired
    private EquipoService equipoService;

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            System.out.println("=== GET /api/equipos ===");
            List<EquipoResponseDTO> equipos = equipoService.obtenerTodos();
            System.out.println("Equipos encontrados: " + equipos.size());
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
            EquipoResponseDTO equipo = equipoService.obtenerPorId(id);
            System.out.println("Equipo encontrado: " + equipo.getSerial());
            return ResponseEntity.ok(equipo);
        } catch (RuntimeException e) {
            System.err.println("Error al obtener equipo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            System.err.println("Error al obtener equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EquipoDTO dto) {
        try {
            System.out.println("=== CREANDO EQUIPO: " + dto.getSerial() + " ===");
            System.out.println("estadoId recibido: " + dto.getEstadoId());
            System.out.println("ubicacionId recibido: " + dto.getUbicacionId());
            System.out.println("tipoId recibido: " + dto.getTipoId());
            System.out.println("marca: " + dto.getMarca());
            System.out.println("modelo: " + dto.getModelo());
            System.out.println("procesador: " + dto.getProcesador());
            System.out.println("memoriaRAM: " + dto.getMemoriaRAM());
            System.out.println("almacenamiento: " + dto.getAlmacenamiento());

            // Validar que los IDs no sean nulos antes de llamar al servicio
            if (dto.getEstadoId() == null) {
                System.err.println("⚠️ estadoId es NULL. Verifica que el frontend esté enviando este campo.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"El campo estadoId es obligatorio\"}");
            }
            if (dto.getUbicacionId() == null) {
                System.err.println("⚠️ ubicacionId es NULL. Verifica que el frontend esté enviando este campo.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"El campo ubicacionId es obligatorio\"}");
            }
            if (dto.getTipoId() == null) {
                System.err.println("⚠️ tipoId es NULL. Verifica que el frontend esté enviando este campo.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"El campo tipoId es obligatorio\"}");
            }

            EquipoResponseDTO saved = equipoService.crear(dto);
            System.out.println("EQUIPO CREADO: " + saved.getSerial());
            System.out.println("Estado asignado: " + (saved.getEstado() != null ? saved.getEstado().getNombre() : "null"));
            System.out.println("Ubicación asignada: " + (saved.getUbicacion() != null ? saved.getUbicacion().getEdificio() : "null"));
            System.out.println("Tipo asignado: " + (saved.getTipo() != null ? saved.getTipo().getNombre() : "null"));

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            System.err.println("Error al crear equipo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            System.err.println("Error al crear equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody EquipoDTO dto) {
        try {
            System.out.println("=== ACTUALIZANDO EQUIPO: " + id + " ===");
            System.out.println("estadoId recibido: " + dto.getEstadoId());
            System.out.println("ubicacionId recibido: " + dto.getUbicacionId());
            System.out.println("tipoId recibido: " + dto.getTipoId());

            if (dto.getEstadoId() == null || dto.getUbicacionId() == null || dto.getTipoId() == null) {
                System.err.println("⚠️ Algunos IDs son NULL en la actualización.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"Todos los campos de relación son obligatorios\"}");
            }

            EquipoResponseDTO updated = equipoService.actualizar(id, dto);
            System.out.println("EQUIPO ACTUALIZADO: " + updated.getSerial());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("Error al actualizar equipo: " + e.getMessage());
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"" + e.getMessage() + "\"}");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
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
            System.out.println("=== ELIMINANDO EQUIPO: " + id + " ===");
            equipoService.eliminar(id);
            System.out.println("EQUIPO ELIMINADO: " + id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Error al eliminar equipo: " + e.getMessage());
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"" + e.getMessage() + "\"}");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            System.err.println("Error al eliminar equipo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}