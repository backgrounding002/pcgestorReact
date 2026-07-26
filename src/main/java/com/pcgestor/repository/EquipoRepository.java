package com.pcgestor.repository;

import com.pcgestor.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    
    Optional<Equipo> findBySerial(String serial);
    
    boolean existsBySerial(String serial);
}