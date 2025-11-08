package com.maderix.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
// @EnableMethodSecurity // Mantém esta anotação para segurança baseada em métodos (@PreAuthorize)
public class WebSecurityConfig {

    private final SecurityFilter securityFilter;

    public WebSecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 1. DESABILITAR CSRF (essencial para APIs REST Stateless)
                .csrf(csrf -> csrf.disable())
                
                // 🚨 CORREÇÃO: MOVER HEADERS PARA AQUI
                // Permite que o H2 Console seja exibido em um Iframe no navegador
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // <-- MOVIDO PARA CIMA

                // 2. CORREÇÃO: Habilitar CORS e usar a configuração
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // 3. POLÍTICA DE SESSÃO: Stateless para JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 4. CONFIGURAÇÃO DE PERMISSÕES (ESTA PARTE FICA IGUAL)
                .authorizeHttpRequests(auth -> auth
                        
                        // Rotas públicas (Auth e Documentação)
                        .requestMatchers("/api/auth/**").permitAll() 
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/swagger-resources/**", "/webjars/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        // 🚨 PERMISSÃO PÚBLICA PARA O H2 CONSOLE
                        // Note que as regras do H2 devem vir antes de .anyRequest().authenticated()
                        .requestMatchers("/h2-console/**").permitAll() 
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        
                        // Exige autenticação (um token válido) para todas as outras requisições
                        .anyRequest().authenticated()
                )
                
                // 5. FILTRO JWT
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // Expõe o AuthenticationManager como um Bean para ser usado no AutenticacaoService
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Método para configurar CORS de forma explícita
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // CORREÇÃO: Ajustar os padrões permitidos para desenvolvimento
        configuration.setAllowedOriginPatterns(List.of("*")); // Permite todas as origens (use domínios específicos em produção)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // Permite todos os cabeçalhos (incluindo Authorization)
        configuration.setAllowCredentials(false); // Manter false para JWT, mas deve ser True se usar cookies/sessão
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a configuração a todas as rotas

        return source;
    }
}