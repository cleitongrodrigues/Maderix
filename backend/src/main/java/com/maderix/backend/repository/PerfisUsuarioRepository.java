package com.maderix.backend.repository;

import com.maderix.backend.model.PerfisUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerfisUsuarioRepository extends JpaRepository<PerfisUsuario, Integer> {

}
