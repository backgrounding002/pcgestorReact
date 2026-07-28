package com.pcgestor.controller;

import com.pcgestor.model.EstadoEquipo;
import com.pcgestor.repository.EstadoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados-equipo")
@CrossOrigin(origins = "*")
public class EstadoEquipoController {

    @Autowired
    private EstadoEquipoRepository estadoEquipoRepository;

    @GetMapping
    public ResponseEntity<List<EstadoEquipo>> listar() {
        return ResponseEntity.ok(estadoEquipoRepository.findAll());
    }
}