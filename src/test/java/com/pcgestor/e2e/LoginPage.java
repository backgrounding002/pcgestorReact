package com.pcgestor.e2e;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By inputUsuario = By.id("username");
    private final By inputPassword = By.id("password");
    private final By btnLogin = By.cssSelector("button[type='submit']");
    private final By mensajeError = By.cssSelector(".alert-danger, .swal2-html-container");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void abrir() {
        driver.get(BaseTest.BASE_URL + "/login.html");
    }

    public void ingresarCredenciales(String usuario, String password) {
        WebElement userInput = wait.until(ExpectedConditions.visibilityOfElementLocated(inputUsuario));
        userInput.clear();
        userInput.sendKeys(usuario);

        WebElement passInput = driver.findElement(inputPassword);
        passInput.clear();
        passInput.sendKeys(password);
    }

    public void clickLogin() {
        driver.findElement(btnLogin).click();
    }

    public void login(String usuario, String password) {
        ingresarCredenciales(usuario, password);
        clickLogin();
    }

    public boolean esperarRedireccionDashboard() {
        try {
            wait.until(ExpectedConditions.urlContains("dashboard.html"));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String obtenerMensajeError() {
        try {
            WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(mensajeError));
            return error.getText();
        } catch (Exception e) {
            return "";
        }
    }

    public String obtenerTokenLocalStorage() {
        return (String) ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("return localStorage.getItem('token');");
    }
}