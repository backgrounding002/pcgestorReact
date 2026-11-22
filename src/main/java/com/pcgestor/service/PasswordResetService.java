package com.pcgestor.service;

import com.pcgestor.model.PasswordResetToken;
import com.pcgestor.model.Usuario;
import com.pcgestor.repository.PasswordResetTokenRepository;
import com.pcgestor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String solicitarRecuperacion(String username) {
        // Buscar si el usuario existe
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("El usuario no existe"));

        // Eliminar tokens anteriores del mismo usuario (limpieza)
        tokenRepository.deleteByUsuarioId(usuario.getId());

        // Generar un token único (UUID)
        String tokenStr = UUID.randomUUID().toString();
        
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenStr);
        token.setUsuario(usuario);
        token.setFechaExpiracion(LocalDateTime.now().plusMinutes(15)); // Expira en 15 min

        tokenRepository.save(token);

        // SIMULACIÓN: Retornamos el token en lugar de enviarlo por correo
        return tokenStr;
    }

    @Transactional
    public String cambiarPassword(String tokenStr, String nuevaPassword) {
        // Buscar el token en la BD
        PasswordResetToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Token inválido o inexistente"));

        // Validar que no haya expirado
        if (token.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token ha expirado. Solicita uno nuevo.");
        }

        // Actualizar la contraseña del usuario
        Usuario usuario = token.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        // Eliminar el token para que no se vuelva a usar
        tokenRepository.delete(token);

        return "Contraseña actualizada correctamente";
    }
}