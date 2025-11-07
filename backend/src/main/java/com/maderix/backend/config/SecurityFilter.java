package com.maderix.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.maderix.backend.model.Usuarios;
import com.maderix.backend.repository.UsuariosRepository;
import com.maderix.backend.service.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter{

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuariosRepository usuariosRepository;

    protected void doFilterInternal(HttpServletRequest request
                                   ,HttpServletResponse response
                                   ,FilterChain filterChain) throws ServletException, IOException{
        
        String token = this.recoverToken(request);

        if(token != null){
            String login = tokenService.validaToken(token);

            if(!login.isEmpty()){
                UserDetails user = usuariosRepository.findByNmLogin(login)
                                                     .orElse(null);

            if(user != null){
                UsernamePasswordAuthenticationToken autentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(autentication);
            }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null) return null;

        return authHeader.replace("Bearer ", "");
    }

}
