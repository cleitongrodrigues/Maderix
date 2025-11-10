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
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")
                || path.startsWith("/api/auth")
                || path.equals("/")
                || path.equals("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = recoverToken(request);

        if (token != null) {
            String login = tokenService.validaToken(token);

            if (login != null && !login.isEmpty()) {
                var userOpt = usuariosRepository.findByNmLogin(login);
                if (userOpt.isPresent()) {
                    var user = userOpt.get();
                    var authentication = new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
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
