package com.maderix.backend.repository;

import com.maderix.backend.model.TokensRecuperacao;
import com.maderix.backend.model.Usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface TokensRecuperacaoRepository extends JpaRepository<TokensRecuperacao, Integer> {
    Optional<TokensRecuperacao> findByToken(String token);
    Optional<TokensRecuperacao> findByTokenAndUtilizadoFalse(String token);
    List<TokensRecuperacao> findByUsuario(Usuarios usuario);

    @Query("DELETE FROM TokensRecuperacao t WHERE t.Data_Expiracao < :now OR t.Utilizado = true")
    void deleteExpiredOrUsedTokens(@Param("now") LocalDateTime now);
}