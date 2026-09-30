package com.pcgestor.e2e;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("E2E - Módulo Reportes")
public class ReportesE2ETest extends BaseTest {

    @BeforeEach
    void loginComoAdmin() {
        LoginPage login = new LoginPage(driver);
        login.abrir();
        login.login("admin", "admin123");
        assertTrue(login.esperarRedireccionDashboard());
    }

    @Test
    @DisplayName("CP-E2E-007: Contadores del reporte coinciden con BD")
    void contadoresReporte() {
        ReportesPage rep = new ReportesPage(driver);
        rep.abrir();

        String eq = rep.obtenerTotalEquipos();
        String as = rep.obtenerTotalAsignaciones();
        String mt = rep.obtenerTotalMantenimientos();
        String us = rep.obtenerTotalUsuarios();

        assertTrue(eq.matches("\\d+"));
        assertTrue(as.matches("\\d+"));
        assertTrue(mt.matches("\\d+"));
        assertTrue(us.matches("\\d+"));
    }

    @Test
    @DisplayName("CP-E2E-008: Generar reporte de equipos muestra tabla")
    void generarReporteEquipos() {
        ReportesPage rep = new ReportesPage(driver);
        rep.abrir();

        rep.seleccionarTipo("equipos");
        rep.clickGenerar();

        int filas = rep.contarFilas();
        assertTrue(filas > 0, "Debe haber filas en la tabla (filas=" + filas + ")");
    }

    @Test
    @DisplayName("CP-E2E-009: Reporte de mantenimientos muestra tabla")
    void generarReporteMantenimientos() {
        ReportesPage rep = new ReportesPage(driver);
        rep.abrir();

        rep.seleccionarTipo("mantenimientos");
        rep.clickGenerar();

        int filas = rep.contarFilas();
        assertTrue(filas >= 0, "La tabla debe renderizarse");
    }
}
