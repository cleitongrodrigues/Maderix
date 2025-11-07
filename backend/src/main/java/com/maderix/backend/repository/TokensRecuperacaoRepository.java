package com.maderix.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.maderix.backend.model.TokensRecuperacao;
import com.maderix.backend.model.Usuarios;

import jakarta.transaction.Transactional;

@Repository
public interface TokensRecuperacaoRepository extends JpaRepository<TokensRecuperacao, Integer> {
    Optional<TokensRecuperacao> findByToken(String token);
    // Optional<TokensRecuperacao> findByTokenAndUtilizadoFalse(String token);
    List<TokensRecuperacao> findByUsuario(Usuarios usuario);
    @Query("SELECT t FROM TokensRecuperacao t WHERE t.token = :token AND t.utilizado = false AND t.dataExpiracao > :now")
    Optional<TokensRecuperacao> findValidToken(@Param("token") String token, @Param("now") LocalDateTime now);


    @Modifying
    @Transactional
    @Query("DELETE FROM TokensRecuperacao t WHERE t.dataExpiracao < :now OR t.utilizado = true")
    void deleteExpiredOrUsedTokens(@Param("now") LocalDateTime now);
}