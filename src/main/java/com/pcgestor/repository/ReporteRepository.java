package com.pcgestor.repository;

import com.pcgestor.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findByTipo(String tipo);
    List<Reporte> findByFechaBetween(LocalDate inicio, LocalDate fin);
    List<Reporte> findByAdminId(Long adminId);
    List<Reporte> findByTipoAndFechaBetween(String tipo, LocalDate inicio, LocalDate fin);
}