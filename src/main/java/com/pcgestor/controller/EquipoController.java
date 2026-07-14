package com.pcgestor.controller;

import com.pcgestor.model.Equipo;
import com.pcgestor.repository.EquipoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {
    private final EquipoRepository repository;

    public EquipoController(EquipoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Equipo> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Equipo obtener(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Equipo crear(@RequestBody Equipo equipo) {
        return repository.save(equipo);
    }

    @PutMapping("/{id}")
    public Equipo actualizar(@PathVariable Long id, @RequestBody Equipo equipo) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        equipo.setId(id);
        return repository.save(equipo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}