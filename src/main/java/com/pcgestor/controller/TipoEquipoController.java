package com.pcgestor.controller;

import com.pcgestor.model.TipoEquipo;
import com.pcgestor.repository.TipoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-equipo")
@CrossOrigin(origins = "*")
public class TipoEquipoController {

    @Autowired
    private TipoEquipoRepository tipoEquipoRepository;

    @GetMapping
    public ResponseEntity<List<TipoEquipo>> listar() {
        return ResponseEntity.ok(tipoEquipoRepository.findAll());
    }
}