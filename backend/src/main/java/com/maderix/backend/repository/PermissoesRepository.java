package com.maderix.backend.repository;

import com.maderix.backend.model.Permissoes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PermissoesRepository extends JpaRepository<Permissoes, Integer> {
    Optional<Permissoes> findByCodigo(String codigo);
}