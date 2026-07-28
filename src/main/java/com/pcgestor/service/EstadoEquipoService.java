package com.pcgestor.service;

import com.pcgestor.model.EstadoEquipo;
import com.pcgestor.repository.EstadoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadoEquipoService {

    @Autowired
    private EstadoEquipoRepository estadoEquipoRepository;

    public List<EstadoEquipo> obtenerTodos() {
        return estadoEquipoRepository.findAll();
    }
}