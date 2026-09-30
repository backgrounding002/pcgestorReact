package com.pcgestor.controller;

import com.pcgestor.dto.DashboardStatsDTO;
import com.pcgestor.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO','USER')")
    public ResponseEntity<DashboardStatsDTO> stats() {
        return ResponseEntity.ok(dashboardService.obtenerEstadisticas());
    }
}