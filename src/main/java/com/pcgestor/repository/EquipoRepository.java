package com.pcgestor.repository;

import com.pcgestor.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    Optional<Equipo> findBySerial(String serial);

    boolean existsBySerial(String serial);

    long countByActivoTrue();

    @Query("SELECT e.estado.nombre, COUNT(e) FROM Equipo e WHERE e.activo = true GROUP BY e.estado.nombre")
    List<Object[]> contarEquiposPorEstado();
}