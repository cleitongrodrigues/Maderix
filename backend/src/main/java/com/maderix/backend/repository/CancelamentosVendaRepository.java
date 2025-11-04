package com.maderix.backend.repository;

import com.maderix.backend.model.CancelamentosVenda;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CancelamentosVendaRepository extends JpaRepository<CancelamentosVenda, Integer> {
    Optional<CancelamentosVenda> findByVenda(Vendas venda);
    List<CancelamentosVenda> findByUsuario(Usuarios usuario);
}