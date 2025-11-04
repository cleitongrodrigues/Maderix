package com.maderix.backend.repository;

import com.maderix.backend.model.PagamentosVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PagamentosVendaRepository extends JpaRepository<PagamentosVenda, Integer> {
    List<PagamentosVenda> findByID_Venda(Integer idVenda);
    List<PagamentosVenda> findByID_Conta(Integer idConta);
    List<PagamentosVenda> findByID_Usuario(Integer idUsuario);
    
    @Query("SELECT SUM(p.valor) FROM PagamentosVenda p WHERE p.idVenda = :idVenda")
    Double getTotalPagoByVenda(Integer idVenda);
}