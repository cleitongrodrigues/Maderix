package com.maderix.backend.repository;

import com.maderix.backend.model.TokensRecuperacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface TokensRecuperacaoRepository extends JpaRepository<TokensRecuperacao, Integer> {
    Optional<TokensRecuperacao> findByToken(String token);
    Optional<TokensRecuperacao> findByTokenAndUtilizadoFalse(String token);
    List<TokensRecuperacao> findByID_Usuario(Integer idUsuario);
    
    @Modifying
    @Query("DELETE FROM TokensRecuperacao t WHERE t.dataExpiracao < :now OR t.utilizado = true")
    void deleteExpiredOrUsedTokens(LocalDateTime now);
}