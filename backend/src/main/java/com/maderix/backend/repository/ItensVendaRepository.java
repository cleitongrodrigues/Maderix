package com.maderix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.maderix.backend.model.ItensVenda;

@Repository
public interface ItensVendaRepository extends JpaRepository<ItensVenda, Integer> {
    @Query("SELECT i FROM ItensVenda i WHERE i.ID_Venda.idVenda = :idVenda")
    List<ItensVenda> findItensByVendaId(Integer idVenda);


}
