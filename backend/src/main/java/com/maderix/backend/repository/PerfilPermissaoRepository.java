package com.maderix.backend.repository;

import com.maderix.backend.model.PerfilPermissao;
import com.maderix.backend.model.PerfilPermissaoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerfilPermissaoRepository extends JpaRepository<PerfilPermissao, PerfilPermissaoId> {
    List<PerfilPermissao> findByID_Perfil(Integer idPerfil);
    List<PerfilPermissao> findByID_Permissao(Integer idPermissao);
}