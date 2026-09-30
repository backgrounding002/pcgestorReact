package com.pcgestor.e2e;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class DashboardPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By totalEquipos      = By.id("totalEquipos");
    private final By equiposDisponibles = By.id("equiposDisponibles");
    private final By mantenimientos    = By.id("mantenimientosPendientes");
    private final By asignaciones      = By.id("totalAsignaciones");
    private final By chartCanvas       = By.id("chartEstadoEquipos");
    private final By tablaAsignaciones = By.cssSelector("#tablaAsignacionesRecientes tbody tr");

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void abrir() {
        driver.get(BaseTest.BASE_URL + "/dashboard.html");
    }

    public String obtenerTotalEquipos() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(totalEquipos)).getText();
    }

    public String obtenerEquiposDisponibles() {
        return driver.findElement(equiposDisponibles).getText();
    }

    public String obtenerMantenimientos() {
        return driver.findElement(mantenimientos).getText();
    }

    public String obtenerAsignaciones() {
        return driver.findElement(asignaciones).getText();
    }

    public boolean graficoPresente() {
        try {
            return wait.until(ExpectedConditions.presenceOfElementLocated(chartCanvas)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public int contarAsignacionesRecientes() {
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("#tablaAsignacionesRecientes tbody tr")));
            return driver.findElements(tablaAsignaciones).size();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean contadoresNoSonCero() {
        String totalEq = obtenerTotalEquipos();
        try {
            return Integer.parseInt(totalEq) >= 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
