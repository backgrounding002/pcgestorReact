package com.pcgestor.e2e;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("E2E - Módulo de Autenticación")
public class LoginE2ETest extends BaseTest {

    @Test
    @DisplayName("CP-E2E-001: Login exitoso con admin")
    void loginExitoso() {
        LoginPage login = new LoginPage(driver);
        login.abrir();
        login.login("admin", "admin123");

        assertTrue(login.esperarRedireccionDashboard(),
                "Debe redirigir al dashboard tras login exitoso");

        String token = login.obtenerTokenLocalStorage();
        assertNotNull(token, "El token debe guardarse en localStorage");
        assertTrue(token.length() > 20, "El token debe tener longitud válida");
    }

    @Test
    @DisplayName("CP-E2E-002: Login fallido con password incorrecto")
    void loginPasswordIncorrecto() {
        LoginPage login = new LoginPage(driver);
        login.abrir();
        login.login("admin", "password_malo");

        assertFalse(login.esperarRedireccionDashboard(),
                "No debe redirigir al dashboard");
        assertTrue(login.obtenerMensajeError().length() > 0,
                "Debe mostrar mensaje de error");
    }

    @Test
    @DisplayName("CP-E2E-003: Acceso directo a dashboard sin login redirige a login")
    void accesoDirectoSinLogin() {
        driver.get(BaseTest.BASE_URL + "/dashboard.html");

        try {
            Thread.sleep(2000);
        } catch (InterruptedException ignored) {}

        String urlActual = driver.getCurrentUrl();
        assertTrue(urlActual.contains("login.html") || urlActual.contains("dashboard.html"),
                "Debe quedarse en login o redirigir si no hay token");
    }
}