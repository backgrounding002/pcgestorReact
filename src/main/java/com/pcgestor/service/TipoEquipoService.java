package com.pcgestor.service;

import com.pcgestor.model.TipoEquipo;
import com.pcgestor.repository.TipoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoEquipoService {

    @Autowired
    private TipoEquipoRepository tipoEquipoRepository;

    public List<TipoEquipo> obtenerTodos() {
        return tipoEquipoRepository.findAll();
    }
}