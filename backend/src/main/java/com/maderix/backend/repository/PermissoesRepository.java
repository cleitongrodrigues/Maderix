package com.maderix.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.maderix.backend.model.Permissoes;

@Repository
public interface PermissoesRepository extends JpaRepository<Permissoes, Integer> {
    @Query("SELECT p FROM Permissoes p WHERE p.codigo = :codigo")
    Optional<Permissoes> findByCodigo(@Param("codigo") String codigo);
}