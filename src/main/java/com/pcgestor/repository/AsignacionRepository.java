package com.pcgestor.repository;

import com.pcgestor.model.Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, Long> {

    List<Asignacion> findByUsuarioId(Long usuarioId);

    List<Asignacion> findByEquipoId(Long equipoId);

    List<Asignacion> findByActivaTrue();

    long countByActivaTrue();

    @Query("SELECT a FROM Asignacion a WHERE a.activa = true AND a.equipoId = :equipoId")
    List<Asignacion> findActivasByEquipoId(@Param("equipoId") Long equipoId);

    @Query("SELECT a FROM Asignacion a ORDER BY a.fechaAsignacion DESC")
    List<Asignacion> findRecientes();
}