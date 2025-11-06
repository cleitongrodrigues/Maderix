package com.maderix.backend.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.maderix.backend.model.Usuarios;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(Usuarios usuario){
        try{
            // Usa o algoritmo HMAC256 com a chave secreta
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                              .withIssuer("maderix-api")
                              .withSubject(usuario.getNM_Login())
                              .withExpiresAt(genExpirationDate())
                              .sign(algorithm);
            return token;
        } catch (JWTCreationException e){
            throw new RuntimeException("Erro ao gerar token JWT", e);
        }
    }

    public String validaToken(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                      .withIssuer("maderix-api")
                      .build()
                      .verify(token)
                      .getSubject();
        } catch (JWTVerificationException e){
            return "";
        }
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

}
