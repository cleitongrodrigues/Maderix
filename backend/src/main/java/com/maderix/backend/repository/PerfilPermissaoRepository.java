package com.maderix.backend.repository;

import com.maderix.backend.model.PerfisUsuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerfilPermissaoRepository extends JpaRepository<PerfisUsuario, Integer> {
    List<PerfisUsuario> findByID_Perfil(Integer idPerfil);
    List<PerfisUsuario> findByID_Permissao(Integer idPermissao);
}