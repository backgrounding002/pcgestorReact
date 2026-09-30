package com.pcgestor.service;

import com.pcgestor.dto.ReporteDTO;
import com.pcgestor.dto.ReporteResponseDTO;
import com.pcgestor.model.Reporte;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.ReporteRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired private ReporteRepository reporteRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public List<ReporteResponseDTO> obtenerTodos() {
        return reporteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ReporteResponseDTO obtenerPorId(Long id) {
        Reporte r = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + id));
        return toDTO(r);
    }

    public List<ReporteResponseDTO> filtrar(String tipo, LocalDate inicio, LocalDate fin) {
        List<Reporte> lista;
        if (tipo != null && inicio != null && fin != null) {
            lista = reporteRepository.findByTipoAndFechaBetween(tipo, inicio, fin);
        } else if (tipo != null) {
            lista = reporteRepository.findByTipo(tipo);
        } else if (inicio != null && fin != null) {
            lista = reporteRepository.findByFechaBetween(inicio, fin);
        } else {
            lista = reporteRepository.findAll();
        }
        return lista.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReporteResponseDTO crear(ReporteDTO dto) {
        usuarioRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin no encontrado con ID: " + dto.getAdminId()));

        Reporte r = new Reporte();
        r.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        r.setTipo(dto.getTipo());
        r.setContenido(dto.getContenido());
        r.setAdminId(dto.getAdminId());
        r.setFechaCreacion(LocalDateTime.now());

        return toDTO(reporteRepository.save(r));
    }

    @Transactional
    public ReporteResponseDTO actualizar(Long id, ReporteDTO dto) {
        Reporte r = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + id));

        if (dto.getFecha() != null) r.setFecha(dto.getFecha());
        if (dto.getTipo() != null) r.setTipo(dto.getTipo());
        if (dto.getContenido() != null) r.setContenido(dto.getContenido());
        if (dto.getAdminId() != null) {
            usuarioRepository.findById(dto.getAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin no encontrado con ID: " + dto.getAdminId()));
            r.setAdminId(dto.getAdminId());
        }
        return toDTO(reporteRepository.save(r));
    }

    @Transactional
    public void eliminar(Long id) {
        Reporte r = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + id));
        reporteRepository.delete(r);
    }

    private ReporteResponseDTO toDTO(Reporte r) {
        ReporteResponseDTO dto = new ReporteResponseDTO();
        dto.setIdReporte(r.getIdReporte());
        dto.setFecha(r.getFecha());
        dto.setTipo(r.getTipo());
        dto.setContenido(r.getContenido());
        dto.setAdminId(r.getAdminId());
        dto.setFechaCreacion(r.getFechaCreacion());
        usuarioRepository.findById(r.getAdminId())
                .ifPresent(u -> dto.setAdminUsername(u.getUsername()));
        return dto;
    }
}