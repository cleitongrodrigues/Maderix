package com.maderix.backend.repository;

import com.maderix.backend.model.Materiais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MateriaisRepository extends JpaRepository<Materiais, Integer> {
}
