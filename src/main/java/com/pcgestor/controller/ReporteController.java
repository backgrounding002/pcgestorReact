package com.pcgestor.controller;

import com.pcgestor.dto.ReporteDTO;
import com.pcgestor.dto.ReporteEstadisticasDTO;
import com.pcgestor.dto.ReporteResponseDTO;
import com.pcgestor.repository.AsignacionRepository;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.MantenimientoRepository;
import com.pcgestor.repository.UsuarioRepository;
import com.pcgestor.service.ExportService;
import com.pcgestor.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired private ReporteService reporteService;
    @Autowired private ExportService exportService;

    // Repositorios usados por el endpoint de estadísticas
    @Autowired private EquipoRepository equipoRepository;
    @Autowired private AsignacionRepository asignacionRepository;
    @Autowired private MantenimientoRepository mantenimientoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    // ==================== ESTADÍSTICAS ====================

    /**
     * Devuelve los contadores reales para la página de Reportes:
     * total de equipos, asignaciones, mantenimientos y usuarios activos.
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<ReporteEstadisticasDTO> estadisticas() {
        ReporteEstadisticasDTO dto = new ReporteEstadisticasDTO();
        dto.setTotalEquipos(equipoRepository.count());
        dto.setTotalAsignaciones(asignacionRepository.count());
        dto.setTotalMantenimientos(mantenimientoRepository.count());
        dto.setUsuariosActivos(usuarioRepository.countByActivo(1));
        return ResponseEntity.ok(dto);
    }

    // ==================== CRUD REPORTES ====================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<List<ReporteResponseDTO>> listar() {
        return ResponseEntity.ok(reporteService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(reporteService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/filtrar")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<List<ReporteResponseDTO>> filtrar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.filtrar(tipo, fechaInicio, fechaFin));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody ReporteDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(reporteService.crear(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ReporteDTO dto) {
        try {
            return ResponseEntity.ok(reporteService.actualizar(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            reporteService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // ==================== EXPORTACIÓN EXCEL ====================

    @GetMapping("/export/equipos/excel")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportEquiposExcel() throws IOException {
        return buildExcelResponse(exportService.exportarEquiposExcel(), "equipos.xlsx");
    }

    @GetMapping("/export/asignaciones/excel")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportAsignacionesExcel() throws IOException {
        return buildExcelResponse(exportService.exportarAsignacionesExcel(), "asignaciones.xlsx");
    }

    @GetMapping("/export/mantenimientos/excel")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportMantenimientosExcel() throws IOException {
        return buildExcelResponse(exportService.exportarMantenimientosExcel(), "mantenimientos.xlsx");
    }

    @GetMapping("/export/usuarios/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportUsuariosExcel() throws IOException {
        return buildExcelResponse(exportService.exportarUsuariosExcel(), "usuarios.xlsx");
    }

    @GetMapping("/export/ubicaciones/excel")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportUbicacionesExcel() throws IOException {
        return buildExcelResponse(exportService.exportarUbicacionesExcel(), "ubicaciones.xlsx");
    }

    // ==================== EXPORTACIÓN CSV ====================

    @GetMapping("/export/equipos/csv")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportEquiposCsv() {
        return buildCsvResponse(exportService.exportarEquiposCsv(), "equipos.csv");
    }

    @GetMapping("/export/asignaciones/csv")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportAsignacionesCsv() {
        return buildCsvResponse(exportService.exportarAsignacionesCsv(), "asignaciones.csv");
    }

    @GetMapping("/export/mantenimientos/csv")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<byte[]> exportMantenimientosCsv() {
        return buildCsvResponse(exportService.exportarMantenimientosCsv(), "mantenimientos.csv");
    }

    @GetMapping("/export/usuarios/csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportUsuariosCsv() {
        return buildCsvResponse(exportService.exportarUsuariosCsv(), "usuarios.csv");
    }

    // ==================== HELPERS ====================

    private ResponseEntity<byte[]> buildExcelResponse(ByteArrayInputStream stream, String filename) throws IOException {
        byte[] bytes = stream.readAllBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    private ResponseEntity<byte[]> buildCsvResponse(ByteArrayInputStream stream, String filename) {
        byte[] bytes = stream.readAllBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
        return ResponseEntity.ok().headers(headers).body(bytes);
    }
}