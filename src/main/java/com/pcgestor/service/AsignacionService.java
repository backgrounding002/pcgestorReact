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
    
    /**
     * Obtiene todas las asignaciones.
     * @return Lista de asignaciones
     */
    public List<AsignacionResponseDTO> obtenerTodas() {
        List<Asignacion> asignaciones = asignacionRepository.findAll();
        return asignaciones.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene una asignación por su ID.
     * @param id ID de la asignación
     * @return Asignación encontrada
     * @throws RuntimeException si no existe
     */
    public AsignacionResponseDTO obtenerPorId(Long id) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        return convertirAResponseDTO(asignacion);
    }
    
    /**
     * Obtiene todas las asignaciones de un usuario específico.
     * @param usuarioId ID del usuario
     * @return Lista de asignaciones del usuario
     * @throws RuntimeException si el usuario no existe
     */
    public List<AsignacionResponseDTO> obtenerPorUsuario(Long usuarioId) {
        // Verificar que el usuario existe
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + usuarioId);
        }
        List<Asignacion> asignaciones = asignacionRepository.findByUsuarioId(usuarioId);
        return asignaciones.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene todas las asignaciones de un equipo específico.
     * @param equipoId ID del equipo
     * @return Lista de asignaciones del equipo
     * @throws RuntimeException si el equipo no existe
     */
    public List<AsignacionResponseDTO> obtenerPorEquipo(Long equipoId) {
        // Verificar que el equipo existe
        if (!equipoRepository.existsById(equipoId)) {
            throw new RuntimeException("Equipo no encontrado con ID: " + equipoId);
        }
        List<Asignacion> asignaciones = asignacionRepository.findByEquipoId(equipoId);
        return asignaciones.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Crea una nueva asignación.
     * @param dto Datos de la asignación
     * @return Asignación creada
     * @throws RuntimeException si el equipo o usuario no existen, o si el equipo ya tiene asignación activa
     */
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
    
    /**
     * Actualiza una asignación existente.
     * @param id ID de la asignación
     * @param dto Datos actualizados
     * @return Asignación actualizada
     * @throws RuntimeException si no existe o si el nuevo equipo ya tiene asignación activa
     */
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
    
    /**
     * Elimina una asignación por su ID.
     * @param id ID de la asignación
     * @throws RuntimeException si no existe
     */
    @Transactional
    public void eliminar(Long id) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        asignacionRepository.delete(asignacion);
    }
    
    /**
     * Cambia el estado (activa/inactiva) de una asignación.
     * @param id ID de la asignación
     * @param activa Nuevo estado (true/false)
     * @throws RuntimeException si no existe
     */
    @Transactional
    public void cambiarEstado(Long id, Boolean activa) {
        Asignacion asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        asignacion.setActiva(activa);
        asignacionRepository.save(asignacion);
    }
    
    /**
     * Convierte una entidad Asignacion a su DTO de respuesta.
     * @param asignacion Entidad Asignacion
     * @return DTO con datos completos incluyendo equipo y usuario
     */
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
            equipoDTO.setMemoriaRAM(equipo.getMemoriaRAM());
            equipoDTO.setAlmacenamiento(equipo.getAlmacenamiento());
            // Asignar IDs de las relaciones
            if (equipo.getEstado() != null) {
                equipoDTO.setEstadoId(equipo.getEstado().getId());
            }
            if (equipo.getUbicacionEntity() != null) {
                equipoDTO.setUbicacionId(equipo.getUbicacionEntity().getIdUbicacion());
            }
            if (equipo.getTipo() != null) {
                equipoDTO.setTipoId(equipo.getTipo().getId());
            }
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