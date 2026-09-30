package com.pcgestor.service;

import com.pcgestor.dto.DashboardStatsDTO;
import com.pcgestor.model.Asignacion;
import com.pcgestor.model.Equipo;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.AsignacionRepository;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.MantenimientoRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired private EquipoRepository equipoRepository;
    @Autowired private AsignacionRepository asignacionRepository;
    @Autowired private MantenimientoRepository mantenimientoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public DashboardStatsDTO obtenerEstadisticas() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        dto.setEquiposActivos(equipoRepository.countByActivoTrue());
        dto.setAsignacionesActivas(asignacionRepository.countByActivaTrue());
        dto.setMantenimientosPendientes(mantenimientoRepository.count());

        // Contar equipos con estado "Disponible" (usando el catálogo estados_equipo)
        long disponibles = equipoRepository.findAll().stream()
                .filter(e -> e.getEstado() != null
                        && "Disponible".equalsIgnoreCase(e.getEstado().getNombre()))
                .count();
        dto.setEquiposDisponibles(disponibles);

        // Equipos por estado (para el gráfico donut)
        List<Map<String, Object>> porEstado = new ArrayList<>();
        for (Object[] fila : equipoRepository.contarEquiposPorEstado()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("estado", fila[0] != null ? fila[0] : "Sin estado");
            item.put("cantidad", fila[1]);
            porEstado.add(item);
        }
        dto.setEquiposPorEstado(porEstado);

        // Asignaciones recientes (máximo 5)
        List<Map<String, Object>> recientes = new ArrayList<>();
        List<Asignacion> asignaciones = asignacionRepository.findRecientes();
        int limite = Math.min(5, asignaciones.size());
        for (int i = 0; i < limite; i++) {
            Asignacion a = asignaciones.get(i);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("idAsignacion", a.getIdAsignacion());
            item.put("fecha", a.getFechaAsignacion() != null ? a.getFechaAsignacion().toString() : "");
            item.put("motivo", a.getMotivo());

            Equipo eq = a.getEquipo();
            item.put("equipo", eq != null
                    ? (safe(eq.getMarca()) + " " + safe(eq.getModelo())).trim()
                    : "Equipo #" + a.getEquipoId());

            Usuario u = a.getUsuario();
            item.put("usuario", u != null ? u.getUsername() : "Usuario #" + a.getUsuarioId());
            recientes.add(item);
        }
        dto.setAsignacionesRecientes(recientes);

        return dto;
    }

    private String safe(String s) { return s != null ? s : ""; }
}
