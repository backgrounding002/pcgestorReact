package com.pcgestor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .exceptionHandling()
                .authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"No autorizado\",\"mensaje\":\"Token inválido o no proporcionado\"}");
                })
                .accessDeniedHandler((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"Acceso denegado\",\"mensaje\":\"No tiene permisos para esta operación\"}");
                })
            .and()
            .authorizeRequests()
                // Preflight CORS
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Público
                .antMatchers(
                        "/api/auth/**",
                        "/login.html", "/index.html", "/dashboard.html",
                        "/equipos.html", "/asignaciones.html", "/mantenimientos.html",
                        "/usuarios.html", "/ubicaciones.html", "/reportes.html",
                        "/css/**", "/js/**", "/assets/**", "/img/**", "/favicon.ico"
                ).permitAll()

                // USUARIOS -> solo ADMIN
                .antMatchers("/api/usuarios/**").hasRole("ADMIN")

                // REPORTES -> ADMIN y TECNICO (excepto export usuarios ya restringido por @PreAuthorize)
                .antMatchers("/api/reportes/**").hasAnyRole("ADMIN", "TECNICO")

                // EQUIPOS
                .antMatchers(HttpMethod.GET,    "/api/equipos/**").hasAnyRole("ADMIN", "TECNICO", "USER")
                .antMatchers(HttpMethod.POST,   "/api/equipos/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.PUT,    "/api/equipos/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.DELETE, "/api/equipos/**").hasRole("ADMIN")

                // ASIGNACIONES
                .antMatchers(HttpMethod.GET,    "/api/asignaciones/**").hasAnyRole("ADMIN", "TECNICO", "USER")
                .antMatchers(HttpMethod.POST,   "/api/asignaciones/**").hasAnyRole("ADMIN", "TECNICO", "USER")
                .antMatchers(HttpMethod.PUT,    "/api/asignaciones/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.PATCH,  "/api/asignaciones/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.DELETE, "/api/asignaciones/**").hasRole("ADMIN")

                // MANTENIMIENTOS
                .antMatchers(HttpMethod.GET,    "/api/mantenimientos/**").hasAnyRole("ADMIN", "TECNICO", "USER")
                .antMatchers(HttpMethod.POST,   "/api/mantenimientos/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.PUT,    "/api/mantenimientos/**").hasAnyRole("ADMIN", "TECNICO")
                .antMatchers(HttpMethod.DELETE, "/api/mantenimientos/**").hasRole("ADMIN")

                // UBICACIONES
                .antMatchers(HttpMethod.GET,    "/api/ubicaciones/**").hasAnyRole("ADMIN", "TECNICO", "USER")
                .antMatchers(HttpMethod.POST,   "/api/ubicaciones/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT,    "/api/ubicaciones/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/ubicaciones/**").hasRole("ADMIN")

                // CATÁLOGOS (solo lectura para todos los autenticados)
                .antMatchers(HttpMethod.GET, "/api/tipos-equipo/**", "/api/estados-equipo/**")
                    .hasAnyRole("ADMIN", "TECNICO", "USER")

                .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userDetailsService),
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Content-Disposition"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}