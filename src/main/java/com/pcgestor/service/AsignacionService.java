package com.pcgestor.service;

import com.pcgestor.dto.AsignacionDTO;
import com.pcgestor.dto.AsignacionResponseDTO;
import com.pcgestor.dto.EquipoDTO;
import com.pcgestor.dto.UsuarioDTO;
import com.pcgestor.model.Asignacion;
import com.pcgestor.model.Equipo;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.AsignacionRepository;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsignacionService {
    
    @Autowired
    private AsignacionRepository asignacionRepository;
    
    @Autowired
    private EquipoRepository equipoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<AsignacionResponseDTO> obtenerTodas() {
        List<Asignacion> asignaciones = asignacionRepository.findAll();
        return asignaciones.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    public AsignacionResponseDTO obtenerPorId(Long id) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        return convertirAResponseDTO(asignacion);
    }
    
    @Transactional
    public AsignacionResponseDTO crear(AsignacionDTO dto) {
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + dto.getEquipoId()));
        
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));
        
        List<Asignacion> asignacionesActivas = asignacionRepository.findActivasByEquipoId(dto.getEquipoId());
        if (!asignacionesActivas.isEmpty()) {
            throw new RuntimeException("El equipo ya tiene una asignación activa");
        }
        
        Asignacion asignacion = new Asignacion();
        asignacion.setFechaAsignacion(dto.getFechaAsignacion());
        asignacion.setMotivo(dto.getMotivo());
        asignacion.setEquipoId(dto.getEquipoId());
        asignacion.setUsuarioId(dto.getUsuarioId());
        asignacion.setActiva(dto.getActiva() != null ? dto.getActiva() : true);
        asignacion.setFechaCreacion(LocalDateTime.now());
        
        Asignacion saved = asignacionRepository.save(asignacion);
        return convertirAResponseDTO(saved);
    }
    
    @Transactional
    public AsignacionResponseDTO actualizar(Long id, AsignacionDTO dto) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + dto.getEquipoId()));
        
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));
        
        if (!asignacion.getEquipoId().equals(dto.getEquipoId())) {
            List<Asignacion> asignacionesActivas = asignacionRepository.findActivasByEquipoId(dto.getEquipoId());
            if (!asignacionesActivas.isEmpty()) {
                throw new RuntimeException("El equipo ya tiene una asignación activa");
            }
        }
        
        asignacion.setFechaAsignacion(dto.getFechaAsignacion());
        asignacion.setMotivo(dto.getMotivo());
        asignacion.setEquipoId(dto.getEquipoId());
        asignacion.setUsuarioId(dto.getUsuarioId());
        if (dto.getActiva() != null) {
            asignacion.setActiva(dto.getActiva());
        }
        
        Asignacion updated = asignacionRepository.save(asignacion);
        return convertirAResponseDTO(updated);
    }
    
    @Transactional
    public void eliminar(Long id) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        asignacionRepository.delete(asignacion);
    }
    
    @Transactional
    public void cambiarEstado(Long id, Boolean activa) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        asignacion.setActiva(activa);
        asignacionRepository.save(asignacion);
    }
    
    private AsignacionResponseDTO convertirAResponseDTO(Asignacion asignacion) {
        AsignacionResponseDTO dto = new AsignacionResponseDTO(
                asignacion.getIdAsignacion(),
                asignacion.getFechaAsignacion(),
                asignacion.getMotivo(),
                asignacion.getEquipoId(),
                asignacion.getUsuarioId(),
                asignacion.getActiva()
        );
        
        equipoRepository.findById(asignacion.getEquipoId()).ifPresent(equipo -> {
            EquipoDTO equipoDTO = new EquipoDTO();
            equipoDTO.setId(equipo.getId());
            equipoDTO.setSerial(equipo.getSerial());
            equipoDTO.setMarca(equipo.getMarca());
            equipoDTO.setModelo(equipo.getModelo());
            equipoDTO.setProcesador(equipo.getProcesador());
            // CORREGIDO: getMemoriaRAM() en lugar de getMemoriaram()
            equipoDTO.setMemoriaRAM(equipo.getMemoriaRAM());
            equipoDTO.setAlmacenamiento(equipo.getAlmacenamiento());
            equipoDTO.setEstado(equipo.getEstado());
            equipoDTO.setUbicacion(equipo.getUbicacion());
            dto.setEquipo(equipoDTO);
        });
        
        usuarioRepository.findById(asignacion.getUsuarioId()).ifPresent(usuario -> {
            UsuarioDTO usuarioDTO = new UsuarioDTO();
            usuarioDTO.setId(usuario.getId());
            usuarioDTO.setUsername(usuario.getUsername());
            usuarioDTO.setRole(usuario.getRole());
            dto.setUsuario(usuarioDTO);
        });
        
        return dto;
    }
}