package com.pcgestor.service;

import com.pcgestor.dto.UbicacionDTO;
import com.pcgestor.dto.UbicacionResponseDTO;
import com.pcgestor.model.Ubicacion;
import com.pcgestor.repository.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UbicacionService {

    @Autowired
    private UbicacionRepository ubicacionRepository;

    public List<UbicacionResponseDTO> obtenerTodas() {
        List<Ubicacion> ubicaciones = ubicacionRepository.findAll();
        return ubicaciones.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    public UbicacionResponseDTO obtenerPorId(Long id) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        return convertirAResponseDTO(ubicacion);
    }

    @Transactional
    public UbicacionResponseDTO crear(UbicacionDTO dto) {
        Ubicacion ubicacion = new Ubicacion();
        ubicacion.setEdificio(dto.getEdificio());
        ubicacion.setPiso(dto.getPiso());
        ubicacion.setSala(dto.getSala());
        ubicacion.setDescripcion(dto.getDescripcion());
        ubicacion.setFechaCreacion(LocalDateTime.now());

        Ubicacion saved = ubicacionRepository.save(ubicacion);
        return convertirAResponseDTO(saved);
    }

    @Transactional
    public UbicacionResponseDTO actualizar(Long id, UbicacionDTO dto) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));

        ubicacion.setEdificio(dto.getEdificio());
        ubicacion.setPiso(dto.getPiso());
        ubicacion.setSala(dto.getSala());
        ubicacion.setDescripcion(dto.getDescripcion());

        Ubicacion updated = ubicacionRepository.save(ubicacion);
        return convertirAResponseDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        ubicacionRepository.delete(ubicacion);
    }

    private UbicacionResponseDTO convertirAResponseDTO(Ubicacion ubicacion) {
        UbicacionResponseDTO dto = new UbicacionResponseDTO();
        dto.setIdUbicacion(ubicacion.getIdUbicacion());
        dto.setEdificio(ubicacion.getEdificio());
        dto.setPiso(ubicacion.getPiso());
        dto.setSala(ubicacion.getSala());
        dto.setDescripcion(ubicacion.getDescripcion());
        dto.setFechaCreacion(ubicacion.getFechaCreacion());
        return dto;
    }
}