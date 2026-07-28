package com.pcgestor.repository;

import com.pcgestor.model.EstadoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoEquipoRepository extends JpaRepository<EstadoEquipo, Long> {
    Optional<EstadoEquipo> findByNombre(String nombre);
}