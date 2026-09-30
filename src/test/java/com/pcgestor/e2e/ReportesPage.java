package com.pcgestor.e2e;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ReportesPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By totalEquipos      = By.id("totalEquipos");
    private final By totalAsignaciones = By.id("totalAsignaciones");
    private final By totalMantenimientos = By.id("totalMantenimientos");
    private final By totalUsuarios     = By.id("totalUsuarios");
    private final By selectTipo        = By.id("tipoReporte");
    private final By btnGenerar        = By.id("btnGenerarReporte");
    private final By btnExportar       = By.id("btnExportarExcel");
    private final By filasTabla        = By.cssSelector("#tablaReportes tbody tr");

    public ReportesPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void abrir() {
        driver.get(BaseTest.BASE_URL + "/reportes.html");
    }

    public String obtenerTotalEquipos() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(totalEquipos)).getText();
    }

    public String obtenerTotalAsignaciones() {
        return driver.findElement(totalAsignaciones).getText();
    }

    public String obtenerTotalMantenimientos() {
        return driver.findElement(totalMantenimientos).getText();
    }

    public String obtenerTotalUsuarios() {
        return driver.findElement(totalUsuarios).getText();
    }

    public void seleccionarTipo(String tipo) {
        Select select = new Select(driver.findElement(selectTipo));
        select.selectByValue(tipo);
    }

    public void clickGenerar() {
        driver.findElement(btnGenerar).click();
    }

    public void clickExportar() {
        driver.findElement(btnExportar).click();
    }

    public int contarFilas() {
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("#tablaReportes tbody tr")));
            return driver.findElements(filasTabla).size();
        } catch (Exception e) {
            return 0;
        }
    }
}
