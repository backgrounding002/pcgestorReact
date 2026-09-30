package com.pcgestor.e2e;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("E2E - Módulo Dashboard")
public class DashboardE2ETest extends BaseTest {

    @BeforeEach
    void loginComoAdmin() {
        LoginPage login = new LoginPage(driver);
        login.abrir();
        login.login("admin", "admin123");
        assertTrue(login.esperarRedireccionDashboard(),
                "Login previo requerido para esta prueba");
    }

    @Test
    @DisplayName("CP-E2E-004: Dashboard muestra contadores reales")
    void dashboardMuestraContadores() {
        DashboardPage dash = new DashboardPage(driver);
        dash.abrir();

        String equipos = dash.obtenerTotalEquipos();
        String asign = dash.obtenerAsignaciones();

        assertNotNull(equipos);
        assertNotNull(asign);
        assertTrue(equipos.matches("\\d+"), "Equipos debe ser número, fue: " + equipos);
        assertTrue(asign.matches("\\d+"), "Asignaciones debe ser número, fue: " + asign);
    }

    @Test
    @DisplayName("CP-E2E-005: Gráfico donut se renderiza")
    void graficoDonutSeRenderiza() {
        DashboardPage dash = new DashboardPage(driver);
        dash.abrir();

        assertTrue(dash.graficoPresente(),
                "El canvas del gráfico debe estar visible");
    }

    @Test
    @DisplayName("CP-E2E-006: Tabla de asignaciones recientes tiene datos")
    void tablaAsignacionesRecientes() {
        DashboardPage dash = new DashboardPage(driver);
        dash.abrir();

        int filas = dash.contarAsignacionesRecientes();
        assertTrue(filas > 0,
                "Debe haber al menos una asignación reciente (filas=" + filas + ")");
    }
}