package com.pcgestor.service;

import com.pcgestor.model.Asignacion;
import com.pcgestor.model.Equipo;
import com.pcgestor.model.Mantenimiento;
import com.pcgestor.model.Ubicacion;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.AsignacionRepository;
import com.pcgestor.repository.EquipoRepository;
import com.pcgestor.repository.MantenimientoRepository;
import com.pcgestor.repository.UbicacionRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportService {

    @Autowired private EquipoRepository equipoRepository;
    @Autowired private AsignacionRepository asignacionRepository;
    @Autowired private MantenimientoRepository mantenimientoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private UbicacionRepository ubicacionRepository;

    // ==================== EXCEL ====================

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarEquiposExcel() throws IOException {
        String[] headers = {"ID", "Serial", "Marca", "Modelo", "Procesador", "RAM", "Almacenamiento",
                "Estado", "Ubicación", "Tipo", "Activo"};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Equipos");
            crearHeader(wb, sheet, headers);

            List<Equipo> lista = equipoRepository.findAll();
            int r = 1;
            for (Equipo e : lista) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(e.getId() != null ? e.getId() : 0);
                row.createCell(1).setCellValue(safe(e.getSerial()));
                row.createCell(2).setCellValue(safe(e.getMarca()));
                row.createCell(3).setCellValue(safe(e.getModelo()));
                row.createCell(4).setCellValue(safe(e.getProcesador()));
                row.createCell(5).setCellValue(safe(e.getMemoriaRAM()));
                row.createCell(6).setCellValue(safe(e.getAlmacenamiento()));
                row.createCell(7).setCellValue(e.getEstado() != null ? safe(e.getEstado().getNombre()) : "");
                row.createCell(8).setCellValue(e.getUbicacionEntity() != null ? safe(e.getUbicacionEntity().getEdificio()) : "");
                row.createCell(9).setCellValue(e.getTipo() != null ? safe(e.getTipo().getNombre()) : "");
                row.createCell(10).setCellValue(Boolean.TRUE.equals(e.getActivo()) ? "Sí" : "No");
            }
            autoSize(sheet, headers.length);
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarAsignacionesExcel() throws IOException {
        String[] headers = {"ID", "Fecha", "Motivo", "Equipo ID", "Serial", "Marca", "Modelo",
                "Usuario ID", "Usuario", "Activa"};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Asignaciones");
            crearHeader(wb, sheet, headers);

            List<Asignacion> lista = asignacionRepository.findAll();
            int r = 1;
            for (Asignacion a : lista) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.getIdAsignacion() != null ? a.getIdAsignacion() : 0);
                row.createCell(1).setCellValue(a.getFechaAsignacion() != null ? a.getFechaAsignacion().toString() : "");
                row.createCell(2).setCellValue(safe(a.getMotivo()));
                row.createCell(3).setCellValue(a.getEquipoId() != null ? a.getEquipoId() : 0);
                Equipo eq = a.getEquipo();
                row.createCell(4).setCellValue(eq != null ? safe(eq.getSerial()) : "");
                row.createCell(5).setCellValue(eq != null ? safe(eq.getMarca()) : "");
                row.createCell(6).setCellValue(eq != null ? safe(eq.getModelo()) : "");
                row.createCell(7).setCellValue(a.getUsuarioId() != null ? a.getUsuarioId() : 0);
                Usuario u = a.getUsuario();
                row.createCell(8).setCellValue(u != null ? safe(u.getUsername()) : "");
                row.createCell(9).setCellValue(Boolean.TRUE.equals(a.getActiva()) ? "Sí" : "No");
            }
            autoSize(sheet, headers.length);
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarMantenimientosExcel() throws IOException {
        String[] headers = {"ID", "Fecha", "Tipo", "Descripción", "Costo",
                "Equipo ID", "Serial", "Marca", "Modelo", "Técnico"};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Mantenimientos");
            crearHeader(wb, sheet, headers);

            List<Mantenimiento> lista = mantenimientoRepository.findAll();
            int r = 1;
            for (Mantenimiento m : lista) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(m.getIdMantenimiento() != null ? m.getIdMantenimiento() : 0);
                row.createCell(1).setCellValue(m.getFecha() != null ? m.getFecha().toString() : "");
                row.createCell(2).setCellValue(safe(m.getTipo()));
                row.createCell(3).setCellValue(safe(m.getDescripcion()));
                row.createCell(4).setCellValue(m.getCosto() != null ? m.getCosto().doubleValue() : 0.0);
                row.createCell(5).setCellValue(m.getEquipoId() != null ? m.getEquipoId() : 0);
                Equipo eq = m.getEquipo();
                row.createCell(6).setCellValue(eq != null ? safe(eq.getSerial()) : "");
                row.createCell(7).setCellValue(eq != null ? safe(eq.getMarca()) : "");
                row.createCell(8).setCellValue(eq != null ? safe(eq.getModelo()) : "");
                Usuario t = m.getTecnico();
                row.createCell(9).setCellValue(t != null ? safe(t.getUsername()) : "");
            }
            autoSize(sheet, headers.length);
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarUsuariosExcel() throws IOException {
        String[] headers = {"ID", "Username", "Rol", "Activo", "Estado"};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Usuarios");
            crearHeader(wb, sheet, headers);

            List<Usuario> lista = usuarioRepository.findAll();
            int r = 1;
            for (Usuario u : lista) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(u.getId() != null ? u.getId() : 0);
                row.createCell(1).setCellValue(safe(u.getUsername()));
                row.createCell(2).setCellValue(safe(u.getRole()));
                row.createCell(3).setCellValue(u.getActivo() != null && u.getActivo() == 1 ? "Sí" : "No");
                row.createCell(4).setCellValue(safe(u.getEstado()));
            }
            autoSize(sheet, headers.length);
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarUbicacionesExcel() throws IOException {
        String[] headers = {"ID", "Edificio", "Piso", "Sala", "Descripción"};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Ubicaciones");
            crearHeader(wb, sheet, headers);

            List<Ubicacion> lista = ubicacionRepository.findAll();
            int r = 1;
            for (Ubicacion u : lista) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(u.getIdUbicacion() != null ? u.getIdUbicacion() : 0);
                row.createCell(1).setCellValue(safe(u.getEdificio()));
                row.createCell(2).setCellValue(safe(u.getPiso()));
                row.createCell(3).setCellValue(safe(u.getSala()));
                row.createCell(4).setCellValue(safe(u.getDescripcion()));
            }
            autoSize(sheet, headers.length);
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // ==================== CSV ====================

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarEquiposCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Serial,Marca,Modelo,Procesador,RAM,Almacenamiento,Estado,Ubicacion,Tipo,Activo\n");
        for (Equipo e : equipoRepository.findAll()) {
            sb.append(csv(e.getId())).append(',')
              .append(csv(e.getSerial())).append(',')
              .append(csv(e.getMarca())).append(',')
              .append(csv(e.getModelo())).append(',')
              .append(csv(e.getProcesador())).append(',')
              .append(csv(e.getMemoriaRAM())).append(',')
              .append(csv(e.getAlmacenamiento())).append(',')
              .append(csv(e.getEstado() != null ? e.getEstado().getNombre() : "")).append(',')
              .append(csv(e.getUbicacionEntity() != null ? e.getUbicacionEntity().getEdificio() : "")).append(',')
              .append(csv(e.getTipo() != null ? e.getTipo().getNombre() : "")).append(',')
              .append(Boolean.TRUE.equals(e.getActivo()) ? "Si" : "No").append('\n');
        }
        return new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarAsignacionesCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Fecha,Motivo,EquipoID,Serial,UsuarioID,Usuario,Activa\n");
        for (Asignacion a : asignacionRepository.findAll()) {
            Equipo eq = a.getEquipo();
            Usuario u = a.getUsuario();
            sb.append(csv(a.getIdAsignacion())).append(',')
              .append(csv(a.getFechaAsignacion())).append(',')
              .append(csv(a.getMotivo())).append(',')
              .append(csv(a.getEquipoId())).append(',')
              .append(csv(eq != null ? eq.getSerial() : "")).append(',')
              .append(csv(a.getUsuarioId())).append(',')
              .append(csv(u != null ? u.getUsername() : "")).append(',')
              .append(Boolean.TRUE.equals(a.getActiva()) ? "Si" : "No").append('\n');
        }
        return new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarMantenimientosCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Fecha,Tipo,Descripcion,Costo,EquipoID,Serial,Tecnico\n");
        for (Mantenimiento m : mantenimientoRepository.findAll()) {
            Equipo eq = m.getEquipo();
            Usuario t = m.getTecnico();
            sb.append(csv(m.getIdMantenimiento())).append(',')
              .append(csv(m.getFecha())).append(',')
              .append(csv(m.getTipo())).append(',')
              .append(csv(m.getDescripcion())).append(',')
              .append(csv(m.getCosto())).append(',')
              .append(csv(m.getEquipoId())).append(',')
              .append(csv(eq != null ? eq.getSerial() : "")).append(',')
              .append(csv(t != null ? t.getUsername() : "")).append('\n');
        }
        return new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportarUsuariosCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Username,Rol,Activo,Estado\n");
        for (Usuario u : usuarioRepository.findAll()) {
            sb.append(csv(u.getId())).append(',')
              .append(csv(u.getUsername())).append(',')
              .append(csv(u.getRole())).append(',')
              .append(u.getActivo() != null && u.getActivo() == 1 ? "Si" : "No").append(',')
              .append(csv(u.getEstado())).append('\n');
        }
        return new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    // ==================== UTILIDADES ====================

    private void crearHeader(Workbook wb, Sheet sheet, String[] headers) {
        Row headerRow = sheet.createRow(0);
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        style.setFont(font);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void autoSize(Sheet sheet, int cols) {
        for (int i = 0; i < cols; i++) sheet.autoSizeColumn(i);
    }

    private String safe(String s) { return s != null ? s : ""; }

    private String csv(Object o) {
        if (o == null) return "";
        String s = o.toString();
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) {
            return "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}
