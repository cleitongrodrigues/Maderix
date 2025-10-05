package com.maderix.backend.repository;

import com.maderix.backend.model.Vendas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendasRepository extends JpaRepository<Vendas, Integer> {
}
