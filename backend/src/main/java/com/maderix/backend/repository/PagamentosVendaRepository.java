package com.maderix.backend.repository;

import com.maderix.backend.model.ContasReceber;
import com.maderix.backend.model.PagamentosVenda;
import com.maderix.backend.model.Usuarios;
import com.maderix.backend.model.Vendas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PagamentosVendaRepository extends JpaRepository<PagamentosVenda, Integer> {
    List<PagamentosVenda> findByVendas(Vendas vendas);
    List<PagamentosVenda> findByConta(ContasReceber conta);
    List<PagamentosVenda> findByUsuario(Usuarios usuario);

    @Query("SELECT SUM(p.Valor) FROM PagamentosVenda p WHERE p.vendas = :venda")
    BigDecimal getTotalPagoByVenda(@Param("venda") Vendas venda);
}