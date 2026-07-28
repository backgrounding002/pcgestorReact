package com.pcgestor.service;

import com.pcgestor.dto.EquipoDTO;
import com.pcgestor.dto.EquipoResponseDTO;
import com.pcgestor.dto.EstadoEquipoDTO;
import com.pcgestor.dto.TipoEquipoDTO;
import com.pcgestor.dto.UbicacionDTO;
import com.pcgestor.model.Equipo;
import com.pcgestor.model.EstadoEquipo;
import com.pcgestor.model.TipoEquipo;
import com.pcgestor.model.Ubicacion;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.EstadoEquipoRepository;
import com.pcgestor.repository.TipoEquipoRepository;
import com.pcgestor.repository.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private EstadoEquipoRepository estadoEquipoRepository;

    @Autowired
    private UbicacionRepository ubicacionRepository;

    @Autowired
    private TipoEquipoRepository tipoEquipoRepository;

    public List<EquipoResponseDTO> obtenerTodos() {
        List<Equipo> equipos = equipoRepository.findAll();
        return equipos.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    public EquipoResponseDTO obtenerPorId(Long id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        return convertirAResponseDTO(equipo);
    }

    @Transactional
    public EquipoResponseDTO crear(EquipoDTO dto) {
        if (equipoRepository.existsBySerial(dto.getSerial())) {
            throw new RuntimeException("El serial '" + dto.getSerial() + "' ya está registrado");
        }

        EstadoEquipo estado = null;
        if (dto.getEstadoId() != null) {
            estado = estadoEquipoRepository.findById(dto.getEstadoId())
                    .orElseThrow(() -> new RuntimeException("Estado no encontrado con ID: " + dto.getEstadoId()));
        }

        Ubicacion ubicacion = null;
        if (dto.getUbicacionId() != null) {
            ubicacion = ubicacionRepository.findById(dto.getUbicacionId())
                    .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + dto.getUbicacionId()));
        }

        TipoEquipo tipo = null;
        if (dto.getTipoId() != null) {
            tipo = tipoEquipoRepository.findById(dto.getTipoId())
                    .orElseThrow(() -> new RuntimeException("Tipo de equipo no encontrado con ID: " + dto.getTipoId()));
        }

        Equipo equipo = new Equipo();
        equipo.setSerial(dto.getSerial());
        equipo.setMarca(dto.getMarca());
        equipo.setModelo(dto.getModelo());
        equipo.setProcesador(dto.getProcesador());
        equipo.setMemoriaRAM(dto.getMemoriaRAM());
        equipo.setAlmacenamiento(dto.getAlmacenamiento());
        equipo.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        equipo.setEstado(estado);
        equipo.setUbicacionEntity(ubicacion);
        equipo.setTipo(tipo);

        Equipo saved = equipoRepository.save(equipo);
        return convertirAResponseDTO(saved);
    }

    @Transactional
    public EquipoResponseDTO actualizar(Long id, EquipoDTO dto) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));

        if (!equipo.getSerial().equals(dto.getSerial()) && 
            equipoRepository.existsBySerial(dto.getSerial())) {
            throw new RuntimeException("El serial '" + dto.getSerial() + "' ya está registrado");
        }

        EstadoEquipo estado = null;
        if (dto.getEstadoId() != null) {
            estado = estadoEquipoRepository.findById(dto.getEstadoId())
                    .orElseThrow(() -> new RuntimeException("Estado no encontrado con ID: " + dto.getEstadoId()));
        }

        Ubicacion ubicacion = null;
        if (dto.getUbicacionId() != null) {
            ubicacion = ubicacionRepository.findById(dto.getUbicacionId())
                    .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + dto.getUbicacionId()));
        }

        TipoEquipo tipo = null;
        if (dto.getTipoId() != null) {
            tipo = tipoEquipoRepository.findById(dto.getTipoId())
                    .orElseThrow(() -> new RuntimeException("Tipo de equipo no encontrado con ID: " + dto.getTipoId()));
        }

        equipo.setSerial(dto.getSerial());
        equipo.setMarca(dto.getMarca());
        equipo.setModelo(dto.getModelo());
        equipo.setProcesador(dto.getProcesador());
        equipo.setMemoriaRAM(dto.getMemoriaRAM());
        equipo.setAlmacenamiento(dto.getAlmacenamiento());
        equipo.setActivo(dto.getActivo() != null ? dto.getActivo() : equipo.getActivo());
        equipo.setEstado(estado);
        equipo.setUbicacionEntity(ubicacion);
        equipo.setTipo(tipo);

        Equipo updated = equipoRepository.save(equipo);
        return convertirAResponseDTO(updated);
    }

    @Transactional
    public void eliminar(Long id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        equipoRepository.delete(equipo);
    }

    private EquipoResponseDTO convertirAResponseDTO(Equipo equipo) {
        EquipoResponseDTO dto = new EquipoResponseDTO();
        dto.setId(equipo.getId());
        dto.setSerial(equipo.getSerial());
        dto.setMarca(equipo.getMarca());
        dto.setModelo(equipo.getModelo());
        dto.setProcesador(equipo.getProcesador());
        dto.setMemoriaRAM(equipo.getMemoriaRAM());
        dto.setAlmacenamiento(equipo.getAlmacenamiento());
        dto.setActivo(equipo.getActivo());

        if (equipo.getEstado() != null) {
            EstadoEquipoDTO estadoDTO = new EstadoEquipoDTO();
            estadoDTO.setId(equipo.getEstado().getId());
            estadoDTO.setNombre(equipo.getEstado().getNombre());
            estadoDTO.setDescripcion(equipo.getEstado().getDescripcion());
            dto.setEstado(estadoDTO);
        }

        if (equipo.getUbicacionEntity() != null) {
            UbicacionDTO ubicacionDTO = new UbicacionDTO();
            ubicacionDTO.setIdUbicacion(equipo.getUbicacionEntity().getIdUbicacion());
            ubicacionDTO.setEdificio(equipo.getUbicacionEntity().getEdificio());
            ubicacionDTO.setPiso(equipo.getUbicacionEntity().getPiso());
            ubicacionDTO.setSala(equipo.getUbicacionEntity().getSala());
            ubicacionDTO.setDescripcion(equipo.getUbicacionEntity().getDescripcion());
            dto.setUbicacion(ubicacionDTO);
        }

        if (equipo.getTipo() != null) {
            TipoEquipoDTO tipoDTO = new TipoEquipoDTO();
            tipoDTO.setId(equipo.getTipo().getId());
            tipoDTO.setNombre(equipo.getTipo().getNombre());
            tipoDTO.setDescripcion(equipo.getTipo().getDescripcion());
            dto.setTipo(tipoDTO);
        }

        return dto;
    }
}