package com.maderix.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final SecurityFilter securityFilter;

    public WebSecurityConfig(SecurityFilter securityFilter){
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.csrf(csrf -> csrf.disable()) //Desabilita CRSF  
                    //Configura a politca de sessao para ser stateless
                   .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                   //Configuração de autorizações/permissoes de rotas
                   .authorizeHttpRequests(authorize -> authorize 
                                                      .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                                                      .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                                                      .anyRequest().authenticated()
                                         )
                   //Adiciona o filtro JWT antes do filtro padrao de login e senha 
                   .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                   .build();
    }

    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
