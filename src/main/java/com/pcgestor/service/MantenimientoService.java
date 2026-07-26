package com.pcgestor.service;

import com.pcgestor.dto.*;
import com.pcgestor.model.Mantenimiento;
import com.pcgestor.model.Equipo;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.MantenimientoRepository;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MantenimientoService {

    @Autowired
    private MantenimientoRepository mantenimientoRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<MantenimientoResponseDTO> obtenerTodos() {
        List<Mantenimiento> mantenimientos = mantenimientoRepository.findAll();
        return mantenimientos.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    public MantenimientoResponseDTO obtenerPorId(Long id) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mantenimiento no encontrado con ID: " + id));
        return convertirAResponseDTO(mantenimiento);
    }

    @Transactional
    public MantenimientoResponseDTO crear(MantenimientoDTO dto) {
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + dto.getEquipoId()));

        Usuario tecnico = usuarioRepository.findById(dto.getTecnicoId())
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado con ID: " + dto.getTecnicoId()));

        Mantenimiento mantenimiento = new Mantenimiento();
        mantenimiento.setFecha(dto.getFecha());
        mantenimiento.setTipo(dto.getTipo());
        mantenimiento.setDescripcion(dto.getDescripcion());
        mantenimiento.setCosto(dto.getCosto());
        mantenimiento.setEquipoId(dto.getEquipoId());
        mantenimiento.setTecnicoId(dto.getTecnicoId());
        mantenimiento.setFechaCreacion(LocalDateTime.now());

        Mantenimiento saved = mantenimientoRepository.save(mantenimiento);
        return convertirAResponseDTO(saved);
    }

    @Transactional
    public MantenimientoResponseDTO actualizar(Long id, MantenimientoDTO dto) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mantenimiento no encontrado con ID: " + id));

        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + dto.getEquipoId()));

        Usuario tecnico = usuarioRepository.findById(dto.getTecnicoId())
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado con ID: " + dto.getTecnicoId()));

        mantenimiento.setFecha(dto.getFecha());
        mantenimiento.setTipo(dto.getTipo());
        mantenimiento.setDescripcion(dto.getDescripcion());
        mantenimiento.setCosto(dto.getCosto());
        mantenimiento.setEquipoId(dto.getEquipoId());
        mantenimiento.setTecnicoId(dto.getTecnicoId());

        Mantenimiento updated = mantenimientoRepository.save(mantenimiento);
        return convertirAResponseDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        Mantenimiento mantenimiento = mantenimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mantenimiento no encontrado con ID: " + id));
        mantenimientoRepository.delete(mantenimiento);
    }

    private MantenimientoResponseDTO convertirAResponseDTO(Mantenimiento mantenimiento) {
        MantenimientoResponseDTO dto = new MantenimientoResponseDTO();
        dto.setIdMantenimiento(mantenimiento.getIdMantenimiento());
        dto.setFecha(mantenimiento.getFecha());
        dto.setTipo(mantenimiento.getTipo());
        dto.setDescripcion(mantenimiento.getDescripcion());
        dto.setCosto(mantenimiento.getCosto());
        dto.setEquipoId(mantenimiento.getEquipoId());
        dto.setTecnicoId(mantenimiento.getTecnicoId());

        equipoRepository.findById(mantenimiento.getEquipoId()).ifPresent(equipo -> {
            EquipoDTO equipoDTO = new EquipoDTO();
            equipoDTO.setId(equipo.getId());
            equipoDTO.setMarca(equipo.getMarca());
            equipoDTO.setModelo(equipo.getModelo());
            equipoDTO.setSerial(equipo.getSerial());
            dto.setEquipo(equipoDTO);
        });

        usuarioRepository.findById(mantenimiento.getTecnicoId()).ifPresent(tecnico -> {
            UsuarioDTO usuarioDTO = new UsuarioDTO();
            usuarioDTO.setId(tecnico.getId());
            usuarioDTO.setUsername(tecnico.getUsername());
            usuarioDTO.setRole(tecnico.getRole());
            dto.setTecnico(usuarioDTO);
        });

        return dto;
    }
}
