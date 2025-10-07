package com.maderix.backend.repository;

import com.maderix.backend.model.ItensVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItensVendaRepository extends JpaRepository<ItensVenda, Integer> {
    @Query("SELECT i FROM ItensVenda i WHERE i.ID_Venda.ID_Venda = :idVenda")
    List<ItensVenda> findItensByVendaId(@Param("idVenda") Integer idVenda);

}
