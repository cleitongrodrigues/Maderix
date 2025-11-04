package com.maderix.backend.repository;

import com.maderix.backend.model.CancelamentosVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CancelamentosVendaRepository extends JpaRepository<CancelamentosVenda, Integer> {
    Optional<CancelamentosVenda> findByID_Venda(Integer idVenda);
    List<CancelamentosVenda> findByID_Usuario(Integer idUsuario);
}