package com.maderix.backend.repository;

import com.maderix.backend.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Integer> {
	java.util.List<MovimentacaoEstoque> findByIdMaterial_IdMaterial(Integer idMaterial);
}
