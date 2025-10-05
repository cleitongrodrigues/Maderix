package com.maderix.backend.repository;

import com.maderix.backend.model.ItensVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItensVendaRepostiroty extends JpaRepository<ItensVenda, Integer> {
}
