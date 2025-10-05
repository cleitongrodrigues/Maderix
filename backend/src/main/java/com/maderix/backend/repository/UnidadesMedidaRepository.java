package com.maderix.backend.repository;

import com.maderix.backend.model.UnidadesMedida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadesMedidaRepository extends JpaRepository<UnidadesMedida, Integer> {
}
